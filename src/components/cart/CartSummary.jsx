import { Link } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'

export default function CartSummary({ showCheckoutButton = true }) {
  const { getTotal, getItemCount } = useCartStore()

  const subtotal = getTotal()
  const shipping = 0 // Free shipping
  const tax = subtotal * 0.18 // 18% tax
  const total = subtotal + shipping + tax

  return (
    <div className="bg-white rounded-lg shadow p-6 sticky top-24">
      <h3 className="text-xl font-bold mb-6">Order Summary</h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({getItemCount()} items)</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="text-green-600 font-medium">FREE</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax (18%)</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="border-t pt-3 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      {showCheckoutButton && (
        <>
          <Link
            to="/checkout"
            className="block w-full bg-orange-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-orange-600 transition mb-3"
          >
            Proceed to Checkout
          </Link>

          <Link
            to="/products"
            className="block w-full border-2 border-gray-300 text-gray-700 text-center py-3 rounded-lg font-semibold hover:border-orange-500 hover:text-orange-500 transition"
          >
            Continue Shopping
          </Link>
        </>
      )}

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-green-500">✓</span>
          <span>Secure Checkout</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-green-500">✓</span>
          <span>Free Returns within 7 days</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-green-500">✓</span>
          <span>Cash on Delivery Available</span>
        </div>
      </div>
    </div>
  )
}
