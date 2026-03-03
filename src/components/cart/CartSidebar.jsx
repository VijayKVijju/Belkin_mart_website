import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import CartItem from './CartItem'

export default function CartSidebar({ isOpen, onClose }) {
  const { items, getTotal, getItemCount } = useCartStore()

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                      <h2 className="text-xl font-bold text-gray-900">
                        Shopping Cart ({getItemCount()})
                      </h2>
                      <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                      >
                        <XMarkIcon className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Items */}
                    <div className="flex-1 overflow-y-auto">
                      {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                          <div className="text-6xl mb-4">🛒</div>
                          <p className="text-gray-600 mb-4">Your cart is empty</p>
                          <button
                            onClick={onClose}
                            className="text-orange-600 font-semibold hover:text-orange-700"
                          >
                            Continue Shopping
                          </button>
                        </div>
                      ) : (
                        <div>
                          {items.map((item) => (
                            <CartItem key={item.product.id} item={item} />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                      <div className="border-t p-6">
                        <div className="flex justify-between mb-4">
                          <span className="text-lg font-semibold">Subtotal:</span>
                          <span className="text-xl font-bold">₹{getTotal().toFixed(2)}</span>
                        </div>
                        <Link
                          to="/cart"
                          onClick={onClose}
                          className="block w-full bg-orange-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-orange-600 transition mb-2"
                        >
                          View Cart
                        </Link>
                        <Link
                          to="/checkout"
                          onClick={onClose}
                          className="block w-full border-2 border-orange-500 text-orange-500 text-center py-3 rounded-lg font-semibold hover:bg-orange-50 transition"
                        >
                          Checkout
                        </Link>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
