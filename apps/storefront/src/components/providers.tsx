"use client"

import React, { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { CustomerAuthProvider } from "@/context/customer-auth-context"
import { CartProvider } from "@/context/cart-context"
import { AudioProvider } from "@/context/audio-context"
import { KidsModeProvider } from "@/context/kids-mode-context"
import { FloatingAudioPlayer } from "@/components/audio/floating-audio-player"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <CustomerAuthProvider>
        <KidsModeProvider>
          <CartProvider>
            <AudioProvider>
              {children}
              <FloatingAudioPlayer />
            </AudioProvider>
          </CartProvider>
        </KidsModeProvider>
      </CustomerAuthProvider>
    </QueryClientProvider>
  )
}
