"use client"

import { ReactNode } from "react"
import { Cart } from "./cart"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/stores/cart-store"

interface CartDrawerProps {
  children: ReactNode
}

export function CartDrawer({ children }: CartDrawerProps) {
  const router = useRouter()
  const cartItems = useCartStore((state: any) => state.items)
  const removeItem = useCartStore((state: any) => state.removeItem)
  const updateQuantity = useCartStore((state: any) => state.updateQuantity)
  const clearCart = useCartStore((state: any) => state.clearCart)

  const total = cartItems.reduce(
    (total: number, item: any) => total + item.price * item.quantity,
    0
  )

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <Cart />
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-semibold">
              R$
              {cartItems.reduce(
                (total: number, item: any) => total + item.price * item.quantity,
                0
              )}
            </span>
          </div>
          <Button
            onClick={() => router.push("/prevenda")}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={cartItems.length === 0}
          >
            Finalizar Compra
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}