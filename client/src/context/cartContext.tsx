import { createContext } from 'react'
import type { CartItem } from '../types/cart'
import type { Product, SizeOption } from '../types/product'

export type CartContextValue = {
  cart: CartItem[]
  totalQty: number
  addToCart: (product: Product, size: SizeOption) => void
  removeFromCart: (productId: number, sizeId: number) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)
