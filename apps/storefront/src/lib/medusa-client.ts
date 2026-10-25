const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export type MedusaError = {
  code?: string
  message: string
  status: number
}

/**
 * Robust Core Fetch Wrapper for Medusa v2 API
 */
async function medusaFetch<T>({
  endpoint,
  method = "GET",
  body,
  tags,
  revalidate = 60,
  token,
}: {
  endpoint: string
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: any
  tags?: string[]
  revalidate?: number | false
  token?: string
}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  const publishableApiKey =
    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
    "pk_1eb8a936a6deaad4c09bb179e4dd3a991f6f3a731af7db22edc65164a3ae87c7"
  if (publishableApiKey) {
    headers["x-publishable-api-key"] = publishableApiKey
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }

  // Next.js caching strategy
  if (method === "GET") {
    (fetchOptions as any).next = {
      revalidate,
      tags,
    }
  } else {
    fetchOptions.cache = "no-store"
  }

  const url = `${MEDUSA_BACKEND_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`

  const response = await fetch(url, fetchOptions)

  if (!response.ok) {
    let errorPayload: any
    try {
      errorPayload = await response.json()
    } catch {
      errorPayload = { message: response.statusText }
    }

    const error: MedusaError = {
      status: response.status,
      code: errorPayload?.code || "MEDUSA_REQUEST_FAILED",
      message: errorPayload?.message || "Failed to communicate with Medusa backend",
    }
    throw error
  }

  return response.json() as Promise<T>
}

// ----------------------------------------------------------------------------
// API CLIENT METHODS
// ----------------------------------------------------------------------------

export const medusaClient = {
  // Products
  async getProducts(params?: {
    limit?: number
    offset?: number
    category_id?: string
    collection_id?: string
    region_id?: string
  }) {
    const query = new URLSearchParams()
    if (params?.limit) query.append("limit", params.limit.toString())
    if (params?.offset) query.append("offset", params.offset.toString())
    if (params?.category_id) query.append("category_id", params.category_id)
    if (params?.region_id) query.append("region_id", params.region_id)

    const queryString = query.toString() ? `?${query.toString()}` : ""
    return medusaFetch<{ products: any[]; count: number }>({
      endpoint: `/store/products${queryString}`,
      tags: ["products"],
      revalidate: 60,
    })
  },

  async getProductByHandle(handle: string) {
    const data = await medusaFetch<{ products: any[] }>({
      endpoint: `/store/products?handle=${encodeURIComponent(handle)}`,
      tags: [`product_${handle}`],
      revalidate: 60,
    })
    return data.products?.[0] || null
  },

  // Categories
  async getCategories() {
    return medusaFetch<{ product_categories: any[] }>({
      endpoint: "/store/product-categories",
      tags: ["categories"],
      revalidate: 300,
    })
  },

  // Cart Operations (Zero Price Manipulation: ONLY variant_id and quantity are sent)
  async createCart(regionId?: string) {
    return medusaFetch<{ cart: any }>({
      endpoint: "/store/carts",
      method: "POST",
      body: regionId ? { region_id: regionId } : {},
    })
  },

  async getCart(cartId: string) {
    return medusaFetch<{ cart: any }>({
      endpoint: `/store/carts/${cartId}`,
      method: "GET",
      revalidate: false,
    })
  },

  async addToCart(cartId: string, variantId: string, quantity: number) {
    return medusaFetch<{ cart: any }>({
      endpoint: `/store/carts/${cartId}/line-items`,
      method: "POST",
      body: {
        variant_id: variantId,
        quantity,
      },
    })
  },

  async updateLineItem(cartId: string, lineItemId: string, quantity: number) {
    return medusaFetch<{ cart: any }>({
      endpoint: `/store/carts/${cartId}/line-items/${lineItemId}`,
      method: "POST",
      body: {
        quantity,
      },
    })
  },

  async removeLineItem(cartId: string, lineItemId: string) {
    return medusaFetch<{ cart: any }>({
      endpoint: `/store/carts/${cartId}/line-items/${lineItemId}`,
      method: "DELETE",
    })
  },

  // Checkout
  async completeCart(cartId: string) {
    return medusaFetch<{ type: string; data: any }>({
      endpoint: `/store/carts/${cartId}/complete`,
      method: "POST",
    })
  },
}

export default medusaClient
