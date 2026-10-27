"use client"

import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react"
import { medusaClient } from "@/lib/medusa-client"

export type CartItem = { id: string; title: string; thumbnail?: string; quantity: number; unit_price: number; variant: { id: string; title: string; sku?: string } }
export type Cart = { id: string; items: CartItem[]; subtotal: number; total: number; tax_total: number; currency_code: string; region_id?: string; completed_at?: string | null;shipping_total?:number;shipping_methods?:{id:string;name?:string}[] }
type CartContextType = { cart: Cart | null; isOpen: boolean; setIsOpen: (open: boolean) => void; addItem: (variantId: string, quantity?: number) => Promise<void>; updateQuantity: (id: string, quantity: number) => Promise<void>; removeItem: (id: string) => Promise<void>; resetCart: () => void; itemsCount: number; isLoading: boolean; error: string | null }
const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const activeCart = useRef<Cart | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [pending, setPending] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const queue = useRef<Promise<unknown>>(Promise.resolve())
  const restoring = useRef<Promise<void> | null>(null)
  const save = (value: Cart | null) => { activeCart.current = value; setCart(value) }

  const restore = useCallback(() => {
    if (!restoring.current) restoring.current = (async () => {
      const id = localStorage.getItem("medusa_cart_id")
      if (!id) return
      try {
        const { cart: restored } = await medusaClient.getCart(id)
        if (restored?.completed_at) localStorage.removeItem("medusa_cart_id")
        else if (restored?.id) save(restored)
      } catch (err: any) {
        if ([404, 410].includes(err.status)) localStorage.removeItem("medusa_cart_id")
        else throw err
      }
    })().catch((err) => { restoring.current = null; throw err })
    return restoring.current
  }, [])
  useEffect(() => { restore().catch((err) => setError(err.message || "Unable to restore cart")) }, [restore])

  const enqueue = (action: () => Promise<void>) => {
    setPending((value) => value + 1)
    setError(null)
    const operation = queue.current.catch(() => {}).then(action)
    queue.current = operation
    return operation.catch((err) => { setError(err.message || "Unable to update cart"); throw err }).finally(() => setPending((value) => value - 1))
  }

  const addItem = (variantId: string, quantity = 1) => enqueue(async () => {
    if (!variantId || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 100) throw new Error("Invalid cart item")
    await restore()
    if (!activeCart.current) {
      const {regions}=await medusaClient.getRegions()
      const region=regions.find((item)=>item.currency_code==="sar")||regions[0]
      if(!region)throw new Error("No store region is configured")
      const { cart: created } = await medusaClient.createCart(region.id)
      if (!created?.id) throw new Error("Unable to create cart")
      save(created)
      localStorage.setItem("medusa_cart_id", created.id)
    }
    const { cart: updated } = await medusaClient.addToCart(activeCart.current!.id, variantId, quantity)
    save(updated)
    setIsOpen(true)
  })
  const removeItem = (id: string) => enqueue(async () => {
    if (!activeCart.current) return
    await medusaClient.removeLineItem(activeCart.current.id, id)
    // Medusa's delete endpoint returns a deletion envelope, not a cart.
    const { cart: updated } = await medusaClient.getCart(activeCart.current.id)
    save(updated)
  })
  const updateQuantity = (id: string, quantity: number) => quantity === 0 ? removeItem(id) : enqueue(async () => {
    if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 100) throw new Error("Invalid cart quantity")
    if (!activeCart.current) return
    const { cart: updated } = await medusaClient.updateLineItem(activeCart.current.id, id, quantity)
    save(updated)
  })
  const resetCart = () => { save(null); localStorage.removeItem("medusa_cart_id"); restoring.current = null; setIsOpen(false) }
  return <CartContext.Provider value={{ cart, isOpen, setIsOpen, addItem, updateQuantity, removeItem, resetCart, itemsCount: cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0, isLoading: pending > 0, error }}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within a CartProvider")
  return context
}
