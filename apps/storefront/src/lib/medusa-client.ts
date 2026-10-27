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
    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
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
  if (method === "GET" && revalidate !== false && !token && !endpoint.startsWith("/store/carts")) {
    (fetchOptions as any).next = {
      revalidate,
      tags,
    }
  } else {
    fetchOptions.cache = "no-store"
  }

  const base = typeof window !== "undefined" ? "/api/medusa" : (process.env.MEDUSA_BACKEND_URL || MEDUSA_BACKEND_URL)
  const url = `${base}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`

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

  const text = await response.text()
  if (!text || !text.trim()) {
    return {} as T
  }
  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error("Medusa returned invalid JSON")
  }
}

// ----------------------------------------------------------------------------
// API CLIENT METHODS
// ----------------------------------------------------------------------------

export const medusaClient = {
  // Products
  async getRegions() {
    return medusaFetch<{ regions: any[] }>({ endpoint: "/store/regions", revalidate: 300 })
  },

  async getPricedProduct(handle: string, regionId?: string) {
    if (!regionId) {
      const { regions } = await this.getRegions()
      regionId = regions.find((region) => region.currency_code === "sar")?.id || regions[0]?.id
    }
    if (!regionId) throw new Error("No store region is configured")
    const query = new URLSearchParams({ handle, region_id: regionId, fields: "*variants.calculated_price,+variants.inventory_quantity" })
    const data = await medusaFetch<{ products: any[] }>({ endpoint: `/store/products?${query}`, revalidate: false })
    return data.products[0] || null
  },
  async getProducts(params?: {
    limit?: number
    offset?: number
    category_id?: string
    collection_id?: string
    region_id?: string
    fields?: string
  }) {
    const query = new URLSearchParams()
    if (params?.limit) query.append("limit", params.limit.toString())
    if (params?.offset) query.append("offset", params.offset.toString())
    if (params?.category_id) query.append("category_id", params.category_id)
    if (params?.collection_id) query.append("collection_id", params.collection_id)
    if (params?.region_id) query.append("region_id", params.region_id)
    if (params?.fields) query.append("fields", params.fields)

    const queryString = query.toString() ? `?${query.toString()}` : ""
    return medusaFetch<{ products: any[]; count: number }>({
      endpoint: `/store/products${queryString}`,
      tags: ["products"],
      revalidate: false,
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
  async initiateManualPayment(cartId: string) {
    const { payment_collection } = await medusaFetch<{ payment_collection: { id: string } }>({
      endpoint: "/store/payment-collections", method: "POST", body: { cart_id: cartId },
    })
    return medusaFetch({ endpoint: `/store/payment-collections/${payment_collection.id}/payment-sessions`, method: "POST", body: { provider_id: "pp_system_default" } })
  },

  async updateCart(cartId: string, data: { email: string; shipping_address: any; billing_address?: any }) {
    return medusaFetch<{ cart: any }>({ endpoint: `/store/carts/${cartId}`, method: "POST", body: data })
  },

  async getShippingOptions(cartId: string) {
    return medusaFetch<{ shipping_options: any[] }>({ endpoint: `/store/shipping-options?cart_id=${encodeURIComponent(cartId)}`, revalidate: false })
  },

  async addShippingMethod(cartId: string, optionId: string) {
    return medusaFetch<{ cart: any }>({ endpoint: `/store/carts/${cartId}/shipping-methods`, method: "POST", body: { option_id: optionId } })
  },

  async completeCart(cartId: string) {
    return medusaFetch<{ type: string; order?: any; cart?: any; error?: { message?: string } }>({
      endpoint: `/store/carts/${cartId}/complete`,
      method: "POST",
    })
  },
}

export default medusaClient
