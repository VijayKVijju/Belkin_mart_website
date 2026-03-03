import { TrashIcon } from '@heroicons/react/24/outline'
import { useCartStore } from '../../store/cartStore'

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCartStore()

  return (
    <div className="flex items-center gap-4 p-4 border-b last:border-b-0">
      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
        {item.product.image || '📦'}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
        <p className="text-sm text-gray-600 mt-1">
          ₹{item.product.discountPrice || item.product.price} each
        </p>

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
              className="px-3 py-1 hover:bg-gray-100 transition"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="px-4 py-1 border-x border-gray-300 min-w-[50px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
              className="px-3 py-1 hover:bg-gray-100 transition"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            onClick={() => removeFromCart(item.product.id)}
            className="text-red-500 hover:text-red-700 transition flex items-center gap-1"
            aria-label="Remove item"
          >
            <TrashIcon className="w-5 h-5" />
            <span className="text-sm">Remove</span>
          </button>
        </div>
      </div>

      <div className="text-right">
        <p className="text-lg font-bold text-gray-900">
          ₹{((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  )
}
