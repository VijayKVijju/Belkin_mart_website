import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TrashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useCartStore } from '../store/cartStore'

export default function Cart() {
  const { items, removeFromCart, updateQuantity, getTotal, getItemCount } = useCartStore()
  const [removingId, setRemovingId] = useState(null)

  const handleRemove = (productId) => {
    setRemovingId(productId)
    setTimeout(() => {
      removeFromCart(productId)
      setRemovingId(null)
    }, 250)
  }

  const subtotal = getTotal()
  const shippingFee = subtotal >= 500 ? 0 : 49
  const tax = parseFloat((subtotal * 0.18).toFixed(2))
  const total = parseFloat((subtotal + shippingFee + tax).toFixed(2))

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white rounded-xl shadow-lg p-12 max-w-md mx-auto">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-8">Add some amazing products to get started!</p>
            <Link
              to="/products"
              className="inline-block bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition shadow-md"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">

        <div className="flex items-center gap-3 mb-8">
          <ShoppingBagIcon className="w-8 h-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <span className="bg-orange-100 text-orange-700 text-sm font-semibold px-3 py-1 rounded-full">
            {getItemCount()} item{getItemCount() !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {items.map((item, idx) => {
                const p = item.product
                const unitPrice = parseFloat(p.discount_price || p.price) || 0
                const lineTotal = (unitPrice * item.quantity).toLocaleString('en-IN')
                const isRemoving = removingId === p.id

                return (
                  <div
                    key={p.id}
                    className={`flex items-start gap-4 p-5 transition-all duration-250 ${
                      idx !== items.length - 1 ? 'border-b border-gray-100' : ''
                    } ${isRemoving ? 'opacity-0 scale-98' : 'opacity-100'}`}
                  >
                    <Link to={`/products/${p.id}`} className="flex-shrink-0">
                      <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover hover:scale-105 transition"
                            onError={e => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                        ) : null}
                        <div
                          className="w-full h-full items-center justify-center text-4xl"
                          style={{ display: p.image ? 'none' : 'flex' }}
                        >
                          🛍️
                        </div>
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${p.id}`}
                        className="font-semibold text-gray-900 hover:text-orange-600 transition line-clamp-2 text-sm md:text-base"
                      >
                        {p.name}
                      </Link>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-orange-600 font-bold text-base">
                          ₹{unitPrice.toLocaleString('en-IN')}
                        </span>
                        {p.discount_price && p.price && parseFloat(p.price) > parseFloat(p.discount_price) && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{parseFloat(p.price).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {p.variant_id && p.name.includes('—') && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {p.name.split('—')[1]?.trim()}
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(p.id, item.quantity - 1)}
                            className="px-3 py-1.5 hover:bg-gray-100 transition text-gray-600 font-bold text-lg leading-none"
                          >
                            −
                          </button>
                          <span className="px-3 py-1.5 border-x border-gray-200 min-w-[42px] text-center font-semibold text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(p.id, item.quantity + 1)}
                            className="px-3 py-1.5 hover:bg-gray-100 transition text-gray-600 font-bold text-lg leading-none"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(p.id)}
                          className="text-red-400 hover:text-red-600 transition flex items-center gap-1 text-sm"
                        >
                          <TrashIcon className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-base font-bold text-gray-900">₹{lineTotal}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-400 mt-0.5">{item.quantity} × ₹{unitPrice.toLocaleString('en-IN')}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <Link to="/products" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                ← Continue Shopping
              </Link>
              <button
                onClick={() => {
                  if (window.confirm('Clear all items from cart?')) {
                    items.forEach(i => removeFromCart(i.product.id))
                  }
                }}
                className="text-sm text-gray-400 hover:text-red-500 transition"
              >
                Clear Cart
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-5">Order Summary</h3>

              <div className="space-y-3 mb-5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({getItemCount()} item{getItemCount() !== 1 ? 's' : ''})</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  {shippingFee === 0 ? (
                    <span className="text-green-600 font-semibold">FREE</span>
                  ) : (
                    <span>₹{shippingFee}</span>
                  )}
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span>₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {shippingFee > 0 && (
                <div className="bg-orange-50 border border-orange-100 rounded-lg px-4 py-2.5 mb-5 text-xs text-orange-700">
                  Add <span className="font-bold">₹{(500 - subtotal).toLocaleString('en-IN')}</span> more to get <span className="font-bold">FREE shipping</span>
                </div>
              )}

              <Link
                to="/checkout"
                className="block w-full bg-orange-500 text-white text-center py-3 rounded-xl font-bold hover:bg-orange-600 transition shadow-md mb-3 text-base"
              >
                Proceed to Checkout →
              </Link>

              <Link
                to="/products"
                className="block w-full border-2 border-gray-200 text-gray-700 text-center py-3 rounded-xl font-semibold hover:border-orange-400 hover:text-orange-500 transition text-sm"
              >
                Continue Shopping
              </Link>

              <div className="mt-5 pt-5 border-t border-gray-100 space-y-2.5">
                {[
                  { icon: '🔒', text: 'Secure Checkout' },
                  { icon: '↩️', text: 'Free Returns within 7 days' },
                  { icon: '💰', text: 'Cash on Delivery Available' },
                ].map(b => (
                  <div key={b.text} className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{b.icon}</span>
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}