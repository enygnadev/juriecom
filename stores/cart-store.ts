
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/lib/types'

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item: CartItem) => set((state: CartState) => {
        const existingItem = state.items.find((i: CartItem) => i.id === item.id)
        if (existingItem) {
          return {
            items: state.items.map((i: CartItem) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          }
        }
        return {
          items: [...state.items, { ...item, quantity: 1 }]
        }
      }),
      
      removeItem: (id: string) => set((state: CartState) => ({
        items: state.items.filter((item: CartItem) => item.id !== id)
      })),
      
      updateQuantity: (id: string, quantity: number) => set((state: CartState) => ({
        items: state.items.map((item: CartItem) =>
          item.id === id ? { ...item, quantity } : item
        )
      })),
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        const state = get()
        return state.items.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0)
      }
    }),
    {
      name: 'cart-storage'
    }
  )
)
