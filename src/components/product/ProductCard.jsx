import { Link } from 'react-router-dom'
import { HeartIcon, ShoppingCartIcon, StarIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useCartStore } from '../../store/cartStore'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { formatPrice } from '../../lib/utils'

export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addToCart } = useCartStore()

  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0]
  const discountPercentage = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0

  // Calculate average rating
  const averageRating = product.reviews?.length > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    toast.success('Added to cart!', {
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    })
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', {
      icon: isWishlisted ? '💔' : '❤️',
    })
  }

  return (
    <Link to={`/product/${product.slug}`} className="group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={primaryImage?.image_url || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_featured && (
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                ⭐ Featured
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                {discountPercentage}% OFF
              </span>
            )}
            {product.stock_quantity < 10 && product.stock_quantity > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                Only {product.stock_quantity} left
              </span>
            )}
            {product.stock_quantity === 0 && (
              <span className="bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                Out of Stock
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleWishlist}
              className="bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition"
            >
              {isWishlisted ? (
                <HeartIconSolid className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>

          {/* Quick Add to Cart */}
          {product.stock_quantity > 0 && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-700 shadow-lg flex items-center gap-2"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              Add to Cart
            </button>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Brand/Vendor */}
          {product.brand && (
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              {product.brand}
            </p>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition">
            {product.name}
          </h3>

          {/* Rating */}
          {averageRating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(averageRating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.reviews?.length || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.discount_price || product.price)}
            </span>
            {product.discount_price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Condition Badge */}
          {product.condition && product.condition !== 'new' && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize">
              {product.condition}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}