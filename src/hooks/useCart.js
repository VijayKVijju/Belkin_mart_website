import { useCartStore } from '../store/cartStore'

export function useCart() {
  const {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
    syncCartToDatabase,
    loadCartFromDatabase
  } = useCartStore()

  return {
    items,
    itemCount: getItemCount(),
    total: getTotal(),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    syncCartToDatabase,
    loadCartFromDatabase
  }
}