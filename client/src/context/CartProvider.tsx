import { useEffect, useMemo, useState } from 'react'
import { CartContext } from './cartContext'
import type { CartItem } from '../types/cart'
import type { Product, SizeOption } from '../types/product'

const CART_KEY = 'cart'

function safeLoad(): CartItem[] {
  try {
    const saved = localStorage.getItem(CART_KEY)
    if (!saved) return []
    return JSON.parse(saved) as CartItem[]
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(safeLoad)

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: Product, size: SizeOption) => {
    setCart((prev) => {
      const found = prev.find(
        (item) =>
          item.productId === product.id && item.sizeId === size.id,
      )

      if (found) {
        return prev.map((item) =>
          item.productId === product.id && item.sizeId === size.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [
        ...prev,
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          imageURL: product.imageURL,
          sizeId: size.id,
          sizeLabel: size.label,
          quantity: 1,
        },
      ]
    })
  }

  const removeFromCart = (productId: number, sizeId: number) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.productId === productId && item.sizeId === sizeId),
      ),
    )
  }

  const clearCart = () => setCart([])

  const totalQty = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  )

  return (
    <CartContext.Provider
      value={{ cart, totalQty, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}
