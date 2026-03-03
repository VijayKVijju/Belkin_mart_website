import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TrashIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { HeartIcon } from '@heroicons/react/24/solid'
import { supabase } from '../supabaseClient'
import { useCartStore } from '../store/cartStore'
import toast from 'react-hot-toast'

const SESSION_DURATION_MS = 4 * 60 * 60 * 1000

const debugLog = (label, data, isError = false) => {
  if (isError) {
    console.error(`[WISHLIST ERROR] ${label}:`, data)
  } else {
    console.log(`[WISHLIST] ${label}:`, data)
  }
}

function readLocalSession() {
  const userId = localStorage.getItem('temp_user_id')
  if (!userId) return null
  const loginTime = parseInt(localStorage.getItem('temp_user_login_time') || '0', 10)
  if (loginTime && Date.now() - loginTime > SESSION_DURATION_MS) {
    localStorage.removeItem('temp_user_id')
    localStorage.removeItem('temp_user_phone')
    localStorage.removeItem('temp_user_name')
    localStorage.removeItem('temp_user_login_time')
    return null
  }
  return { id: userId }
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-8 bg-gray-200 rounded w-full mt-3" />
      </div>
    </div>
  )
}

export default function Wishlist() {
  const navigate = useNavigate()
  const addToCart = useCartStore(s => s.addToCart)

  const [userId, setUserId] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState(null)
  const [cartFeedback, setCartFeedback] = useState({})
  const [retryCount, setRetryCount] = useState(0)
  const [error, setError] = useState(null)
  const fetchingRef = useRef(false)

  useEffect(() => {
    const session = readLocalSession()
    if (!session) {
      sessionStorage.setItem('login_return_to', '/wishlist')
      navigate('/login', { replace: true })
    } else {
      setUserId(session.id)
    }
    setAuthChecked(true)
  }, [navigate])

  useEffect(() => {
    if (!userId || !authChecked) return
    if (fetchingRef.current) return
    fetchingRef.current = true

    let cancelled = false

    const run = async () => {
      setLoading(true)
      setError(null)
      debugLog('fetchWishlist', `user_id=${userId}`)

      const { data: wishlist, error: wErr } = await supabase
        .from('wishlist')
        .select('id, product_id, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (cancelled) { fetchingRef.current = false; return }

      if (wErr) {
        debugLog('fetchWishlist', { code: wErr.code, message: wErr.message, details: wErr.details, hint: wErr.hint }, true)
        setError(`[${wErr.code}] ${wErr.message}`)
        setLoading(false)
        fetchingRef.current = false
        return
      }

      debugLog('fetchWishlist', `Got ${wishlist?.length ?? 0} wishlist entries`)

      if (!wishlist || wishlist.length === 0) {
        setItems([])
        setLoading(false)
        fetchingRef.current = false
        return
      }

      const productIds = wishlist.map(w => w.product_id)

      const { data: products, error: pErr } = await supabase
        .from('products')
        .select('id, name, price, discount_price, stock_quantity, brand, condition, categories(id, name, slug)')
        .in('id', productIds)
        .eq('is_active', true)

      if (cancelled) { fetchingRef.current = false; return }

      if (pErr) {
        debugLog('fetchWishlist [products]', { code: pErr.code, message: pErr.message, details: pErr.details, hint: pErr.hint }, true)
        setError(`[${pErr.code}] ${pErr.message}`)
        setLoading(false)
        fetchingRef.current = false
        return
      }

      const { data: images, error: imgErr } = await supabase
        .from('product_images')
        .select('product_id, image_url, is_primary, display_order')
        .in('product_id', productIds)
        .order('display_order', { ascending: true })

      if (cancelled) { fetchingRef.current = false; return }

      if (imgErr) debugLog('fetchWishlist [images]', { code: imgErr.code, message: imgErr.message }, true)

      const imageMap = {}
      if (images) {
        images.forEach(img => {
          if (!imageMap[img.product_id] || img.is_primary) {
            imageMap[img.product_id] = img.image_url
          }
        })
      }

      const productMap = {}
      if (products) products.forEach(p => { productMap[p.id] = p })

      const mapped = wishlist
        .filter(w => productMap[w.product_id])
        .map(w => {
          const p = productMap[w.product_id]
          return {
            wishlistId: w.id,
            id: p.id,
            name: p.name,
            price: parseFloat(p.price) || 0,
            discount_price: p.discount_price ? parseFloat(p.discount_price) : null,
            stock_quantity: p.stock_quantity ?? 0,
            brand: p.brand || '',
            condition: p.condition || '',
            category: p.categories?.name || '',
            categorySlug: p.categories?.slug || '',
            image: imageMap[p.id] || null,
            addedAt: w.created_at,
          }
        })

      debugLog('fetchWishlist [done]', `${mapped.length} items`)

      if (!cancelled) {
        setItems(mapped)
        setLoading(false)
      }
      fetchingRef.current = false
    }

    run()
    return () => { cancelled = true; fetchingRef.current = false }
  }, [userId, authChecked, retryCount])

  const handleRemove = async (wishlistId, productId) => {
    setRemovingId(productId)
    debugLog('removeWishlist', `wishlist_id=${wishlistId}`)

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('id', wishlistId)

    if (error) {
      debugLog('removeWishlist', { code: error.code, message: error.message }, true)
      toast.error('Failed to remove from wishlist')
      setRemovingId(null)
      return
    }

    setItems(prev => prev.filter(i => i.wishlistId !== wishlistId))
    window.dispatchEvent(new Event('wishlistUpdated'))
    toast.success('Removed from wishlist')
    setRemovingId(null)
  }

  const handleAddToCart = (item) => {
    if (item.stock_quantity === 0) return
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      discount_price: item.discount_price,
      image: item.image,
    }, 1)
    toast.success('Added to cart!')
    setCartFeedback(prev => ({ ...prev, [item.id]: true }))
    setTimeout(() => setCartFeedback(prev => ({ ...prev, [item.id]: false })), 1500)
  }

  const discountPct = (price, dp) => dp ? Math.round(((price - dp) / price) * 100) : null

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 30) return `${days} days ago`
    const months = Math.floor(days / 30)
    return months === 1 ? '1 month ago' : `${months} months ago`
  }

  if (!authChecked || loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <HeartIcon className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">

        <div className="flex items-center gap-3 mb-2">
          <HeartIcon className="w-8 h-8 text-red-500" />
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          {items.length > 0 && (
            <span className="bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 rounded-full">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-orange-600">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Wishlist</span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-xl">⚠️</span>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={() => { fetchingRef.current = false; setRetryCount(c => c + 1) }}
              className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg font-semibold transition"
            >
              Retry
            </button>
          </div>
        )}

        {!error && items.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <HeartIcon className="w-20 h-20 text-gray-200 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h2>
            <p className="text-gray-500 mb-8">Save items you love to your wishlist and shop them anytime.</p>
            <Link
              to="/products"
              className="inline-block bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition shadow-md"
            >
              Explore Products
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.map(item => {
                const pct = discountPct(item.price, item.discount_price)
                const isRemoving = removingId === item.id

                return (
                  <div
                    key={item.wishlistId}
                    className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group transition-all duration-300 ${isRemoving ? 'opacity-0 scale-95' : 'opacity-100'}`}
                  >
                    <div className="relative">
                      <Link to={`/products/${item.id}`}>
                        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                            />
                          ) : null}
                          <div
                            style={{ display: item.image ? 'none' : 'flex' }}
                            className="w-full h-full items-center justify-center text-5xl"
                          >
                            🛍️
                          </div>
                        </div>
                      </Link>

                      {pct && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          -{pct}%
                        </span>
                      )}

                      {item.stock_quantity === 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-lg">Out of Stock</span>
                        </div>
                      )}

                      <button
                        onClick={() => handleRemove(item.wishlistId, item.id)}
                        disabled={isRemoving}
                        className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition hover:bg-red-50"
                        title="Remove from wishlist"
                      >
                        <TrashIcon className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>

                    <div className="p-3">
                      <Link to={`/products/${item.id}`}>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-orange-600 transition leading-snug">
                          {item.name}
                        </h3>
                      </Link>

                      {item.brand && (
                        <p className="text-[10px] text-gray-400 mt-0.5">{item.brand}</p>
                      )}

                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-base font-bold text-gray-900">
                          ₹{(item.discount_price || item.price).toLocaleString('en-IN')}
                        </span>
                        {item.discount_price && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <p className="text-[10px] text-gray-300 mt-1">Added {timeAgo(item.addedAt)}</p>

                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={item.stock_quantity === 0}
                        className={`mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition ${
                          item.stock_quantity === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : cartFeedback[item.id]
                            ? 'bg-green-500 text-white'
                            : 'bg-orange-500 text-white hover:bg-orange-600'
                        }`}
                      >
                        <ShoppingCartIcon className="w-3.5 h-3.5" />
                        {item.stock_quantity === 0 ? 'Out of Stock' : cartFeedback[item.id] ? 'Added ✓' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{items.length}</span> item{items.length !== 1 ? 's' : ''} saved to your wishlist
              </p>
              <div className="flex gap-3">
                <Link
                  to="/products"
                  className="border-2 border-gray-200 text-gray-700 px-5 py-2 rounded-xl font-semibold hover:border-orange-400 hover:text-orange-500 transition text-sm"
                >
                  Continue Shopping
                </Link>
                <button
                  onClick={() => items.filter(i => i.stock_quantity > 0).forEach(i => handleAddToCart(i))}
                  disabled={items.every(i => i.stock_quantity === 0)}
                  className="bg-orange-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-orange-600 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ShoppingCartIcon className="w-4 h-4" />
                  Add All to Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}