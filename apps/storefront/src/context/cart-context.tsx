"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { medusaClient } from "@/lib/medusa-client"

export type CartItem = {
  id: string
  title: string
  thumbnail?: string
  quantity: number
  unit_price: number
  variant: {
    id: string
    title: string
    sku?: string
  }
}

export type Cart = {
  id: string
  items: CartItem[]
  subtotal: number
  total: number
  tax_total: number
  currency_code: string
}

type CartContextType = {
  cart: Cart | null
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  addItem: (variantId: string, quantity?: number) => Promise<void>
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
  itemsCount: number
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize or restore active cart from localStorage
  const initCart = useCallback(async () => {
    try {
      const storedCartId = typeof window !== "undefined" ? localStorage.getItem("medusa_cart_id") : null
      if (storedCartId) {
        try {
          const res = await medusaClient.getCart(storedCartId)
          if (res?.cart) {
            setCart(res.cart)
            return
          }
        } catch {
          // If cart has expired or was completed, remove and create fresh
          localStorage.removeItem("medusa_cart_id")
        }
      }

      // Create new cart session
      const newCartRes = await medusaClient.createCart()
      if (newCartRes?.cart?.id) {
        setCart(newCartRes.cart)
        localStorage.setItem("medusa_cart_id", newCartRes.cart.id)
      }
    } catch (error) {
      console.error("[CartContext] Failed to initialize cart:", error)
    }
  }, [])

  useEffect(() => {
    initCart()
  }, [initCart])

  // Zero Price Manipulation: only sends variant_id and quantity
  const addItem = async (variantId: string, quantity = 1) => {
    setIsLoading(true)
    try {
      let activeCartId = cart?.id
      if (!activeCartId) {
        const newCartRes = await medusaClient.createCart()
        activeCartId = newCartRes?.cart?.id
        if (activeCartId) {
          localStorage.setItem("medusa_cart_id", activeCartId)
        }
      }

      if (!activeCartId) {
        throw new Error("Unable to establish or retrieve a valid cart session.")
      }

      const updated = await medusaClient.addToCart(activeCartId, variantId, quantity)
      if (updated?.cart) {
        setCart(updated.cart)
        setIsOpen(true) // Open slide-over cart automatically on add
      }
    } catch (error) {
      console.error("[CartContext] Failed adding item to cart:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (lineItemId: string, quantity: number) => {
    if (!cart?.id) return
    setIsLoading(true)
    try {
      if (quantity <= 0) {
        await removeItem(lineItemId)
        return
      }
      const updated = await medusaClient.updateLineItem(cart.id, lineItemId, quantity)
      if (updated?.cart) {
        setCart(updated.cart)
      }
    } catch (error) {
      console.error("[CartContext] Failed updating item quantity:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (lineItemId: string) => {
    if (!cart?.id) return
    setIsLoading(true)
    try {
      const updated = await medusaClient.removeLineItem(cart.id, lineItemId)
      if (updated?.cart) {
        setCart(updated.cart)
      }
    } catch (error) {
      console.error("[CartContext] Failed removing item from cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const itemsCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        setIsOpen,
        addItem,
        updateQuantity,
        removeItem,
        itemsCount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
