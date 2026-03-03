import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { StarIcon } from '@heroicons/react/24/solid'
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import { useCartStore } from '../store/cartStore'
import { supabase } from '../supabaseClient'
import toast from 'react-hot-toast'

const debugLog = (label, data, isError = false) => {
  if (isError) {
    console.error(`[PRODUCT_DETAILS ERROR] ${label}:`, data)
  } else {
    console.log(`[PRODUCT_DETAILS] ${label}:`, data)
  }
}

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
}

function StarRating({ value, size = 'sm' }) {
  const sz = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <StarIcon
          key={i}
          className={`${sz} ${i <= Math.round(value) ? 'text-yellow-400' : 'text-gray-200'}`}
        />
      ))}
    </div>
  )
}

function ReviewForm({ productId, user, onSubmitted }) {
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!comment.trim()) { toast.error('Please write a review'); return }
    setSubmitting(true)

    const { error } = await supabase.from('reviews').insert({
      product_id: productId,
      user_id: user.id,
      rating,
      title: title.trim() || null,
      comment: comment.trim(),
    })

    if (error) {
      debugLog('submitReview', { code: error.code, message: error.message, details: error.details, hint: error.hint }, true)
      toast.error(`Failed to submit review: ${error.message}`)
    } else {
      toast.success('Review submitted!')
      setTitle('')
      setComment('')
      setRating(5)
      onSubmitted()
    }
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 border border-gray-200 mt-6">
      <h4 className="font-semibold text-gray-900 mb-4">Write a Review</h4>
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Rating</label>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(i => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHoverRating(i)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(i)}
            >
              <StarIcon className={`w-7 h-7 transition ${i <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-200'}`} />
            </button>
          ))}
        </div>
      </div>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Review title (optional)"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Share your experience with this product..."
        rows={3}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 text-sm"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const addToCart = useCartStore((state) => state.addToCart)

  const [product, setProduct] = useState(null)
  const [images, setImages] = useState([])
  const [variants, setVariants] = useState([])
  const [reviews, setReviews] = useState([])
  const [reviewStats, setReviewStats] = useState({ avg: 0, count: 0 })
  const [relatedProducts, setRelatedProducts] = useState([])
  const [user, setUser] = useState(null)
  const [inWishlist, setInWishlist] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [userHasReviewed, setUserHasReviewed] = useState(false)

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  const fetchingRef = useRef(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user)
    })
  }, [])

  useEffect(() => {
    if (fetchingRef.current) return
    fetchingRef.current = true
    let cancelled = false

    const run = async () => {
      setLoading(true)
      setError(null)
      debugLog('fetchProduct', `id=${id}`)

      const { data: prod, error: prodErr } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          discount_price,
          description,
          short_description,
          stock_quantity,
          sku,
          brand,
          condition,
          warranty_period,
          is_active,
          vendor_id,
          category_id,
          categories(id, name, slug),
          vendors(id, business_name)
        `)
        .eq('id', id)
        .eq('is_active', true)
        .maybeSingle()

      if (cancelled) { fetchingRef.current = false; return }

      if (prodErr) {
        debugLog('fetchProduct', { code: prodErr.code, message: prodErr.message, details: prodErr.details, hint: prodErr.hint }, true)
        setError(`[${prodErr.code}] ${prodErr.message}`)
        setLoading(false)
        fetchingRef.current = false
        return
      }

      if (!prod) {
        debugLog('fetchProduct', `No product found for id=${id}`, true)
        setError('Product not found.')
        setLoading(false)
        fetchingRef.current = false
        return
      }

      debugLog('fetchProduct', `Found: "${prod.name}"`)

      const [imagesRes, variantsRes] = await Promise.all([
        supabase
          .from('product_images')
          .select('id, image_url, is_primary, display_order')
          .eq('product_id', id)
          .order('display_order', { ascending: true }),
        supabase
          .from('product_variants')
          .select('id, variant_name, variant_value, price_adjustment, stock_quantity, sku')
          .eq('product_id', id)
          .order('variant_name', { ascending: true }),
      ])

      if (cancelled) { fetchingRef.current = false; return }

      if (imagesRes.error) {
        debugLog('fetchProduct [images]', { code: imagesRes.error.code, message: imagesRes.error.message }, true)
      } else {
        debugLog('fetchProduct [images]', `Got ${imagesRes.data?.length ?? 0} images`)
      }

      if (variantsRes.error) {
        debugLog('fetchProduct [variants]', { code: variantsRes.error.code, message: variantsRes.error.message }, true)
      } else {
        debugLog('fetchProduct [variants]', `Got ${variantsRes.data?.length ?? 0} variants`)
      }

      if (!cancelled) {
        setProduct(prod)
        setImages(imagesRes.data || [])
        setVariants(variantsRes.data || [])
        setLoading(false)

        if (prod.category_id) {
          fetchRelated(prod.category_id, id)
        }
      }
      fetchingRef.current = false
    }

    run()
    return () => { cancelled = true; fetchingRef.current = false }
  }, [id, retryCount])

  useEffect(() => {
    if (!id) return
    fetchReviews()
  }, [id])

  useEffect(() => {
    if (!user || !id) return
    checkWishlist()
    checkUserReview()
  }, [user, id])

  const fetchReviews = async () => {
    setReviewsLoading(true)
    debugLog('fetchReviews', `product_id=${id}`)

    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        title,
        comment,
        is_verified_purchase,
        created_at,
        user_id,
        profiles(full_name, avatar_url)
      `)
      .eq('product_id', id)
      .order('created_at', { ascending: false })

    if (error) {
      debugLog('fetchReviews', { code: error.code, message: error.message, details: error.details, hint: error.hint }, true)
    } else {
      debugLog('fetchReviews', `Got ${data?.length ?? 0} reviews`)
      const list = data || []
      setReviews(list)
      if (list.length > 0) {
        const avg = list.reduce((s, r) => s + r.rating, 0) / list.length
        setReviewStats({ avg: parseFloat(avg.toFixed(1)), count: list.length })
      }
    }
    setReviewsLoading(false)
  }

  const fetchRelated = async (categoryId, excludeId) => {
    debugLog('fetchRelated', `category_id=${categoryId}`)
    const { data, error } = await supabase
      .from('products')
      .select(`id, name, price, discount_price, product_images(image_url, is_primary)`)
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .neq('id', excludeId)
      .limit(4)

    if (error) {
      debugLog('fetchRelated', { code: error.code, message: error.message }, true)
    } else {
      debugLog('fetchRelated', `Got ${data?.length ?? 0} related products`)
      setRelatedProducts(data || [])
    }
  }

  const checkWishlist = async () => {
    const { data } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', id)
      .maybeSingle()
    setInWishlist(!!data)
  }

  const checkUserReview = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', id)
      .maybeSingle()
    setUserHasReviewed(!!data)
  }

  const toggleWishlist = async () => {
    if (!user) { toast.error('Please login to add to wishlist'); return }
    setWishlistLoading(true)
    debugLog('toggleWishlist', `inWishlist=${inWishlist}`)

    if (inWishlist) {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', id)
      if (error) {
        debugLog('toggleWishlist [remove]', { code: error.code, message: error.message }, true)
        toast.error('Failed to remove from wishlist')
      } else {
        setInWishlist(false)
        toast.success('Removed from wishlist')
      }
    } else {
      const { error } = await supabase
        .from('wishlist')
        .insert({ user_id: user.id, product_id: id })
      if (error) {
        debugLog('toggleWishlist [add]', { code: error.code, message: error.message }, true)
        toast.error('Failed to add to wishlist')
      } else {
        setInWishlist(true)
        toast.success('Added to wishlist ❤️')
      }
    }
    setWishlistLoading(false)
  }

  const handleAddToCart = () => {
    if (!product) return
    const effectivePrice = selectedVariant
      ? (product.discount_price || product.price) + (selectedVariant.price_adjustment || 0)
      : (product.discount_price || product.price)

    addToCart({
      id: product.id,
      name: product.name + (selectedVariant ? ` — ${selectedVariant.variant_name}: ${selectedVariant.variant_value}` : ''),
      price: parseFloat(product.price),
      discount_price: parseFloat(effectivePrice),
      variant_id: selectedVariant?.id || null,
      image: images.find(i => i.is_primary)?.image_url || images[0]?.image_url || null,
    }, quantity)

    toast.success('Added to cart!')
    debugLog('handleAddToCart', `product_id=${product.id} qty=${quantity} variant=${selectedVariant?.id || 'none'}`)
  }

  const effectiveStock = selectedVariant
    ? (selectedVariant.stock_quantity ?? product?.stock_quantity ?? 0)
    : (product?.stock_quantity ?? 0)

  const effectivePrice = product
    ? selectedVariant
      ? (product.discount_price || product.price) + (selectedVariant.price_adjustment || 0)
      : product.discount_price || product.price
    : 0

  const discountPct = product?.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : null

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return '1 day ago'
    if (days < 30) return `${days} days ago`
    const months = Math.floor(days / 30)
    return months === 1 ? '1 month ago' : `${months} months ago`
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="aspect-square" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error.includes('not found') ? 'Product Not Found' : 'Something went wrong'}
          </h2>
          <p className="text-gray-500 mb-4 text-sm font-mono">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { fetchingRef.current = false; setRetryCount(c => c + 1) }}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Retry
            </button>
            <Link to="/products" className="border border-gray-300 px-6 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const variantGroups = variants.reduce((acc, v) => {
    if (!acc[v.variant_name]) acc[v.variant_name] = []
    acc[v.variant_name].push(v)
    return acc
  }, {})

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">

        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-orange-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-orange-600">Products</Link>
          {product.categories && (
            <>
              <span>/</span>
              <Link to={`/products?category=${product.categories.slug}`} className="hover:text-orange-600">
                {product.categories.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <div>
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                {images.length > 0 ? (
                  <img
                    src={images[selectedImage]?.image_url}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onError={e => {
                      debugLog('ProductImage [onError]', `url=${images[selectedImage]?.image_url}`, true)
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div
                  className="w-full h-full items-center justify-center text-9xl"
                  style={{ display: images.length > 0 ? 'none' : 'flex' }}
                >
                  🛍️
                </div>
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition ${
                        selectedImage === idx ? 'border-orange-500' : 'border-transparent hover:border-orange-300'
                      }`}
                    >
                      <img
                        src={img.image_url}
                        alt={`View ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.style.display = 'none' }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              {product.vendors && (
                <p className="text-sm text-gray-500 mb-1">by <span className="text-orange-600 font-medium">{product.vendors.business_name}</span></p>
              )}

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <StarRating value={reviewStats.avg || 0} size="md" />
                <span className="text-sm text-gray-500">
                  {reviewStats.avg > 0 ? `${reviewStats.avg} (${reviewStats.count} review${reviewStats.count !== 1 ? 's' : ''})` : 'No reviews yet'}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-5">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{parseFloat(effectivePrice).toLocaleString('en-IN')}
                </span>
                {product.discount_price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ₹{parseFloat(product.price).toLocaleString('en-IN')}
                    </span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                      {discountPct}% OFF
                    </span>
                  </>
                )}
              </div>

              <div className="mb-5">
                {effectiveStock > 0 ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <span className="w-2 h-2 bg-green-600 rounded-full inline-block" />
                    <span className="font-medium text-sm">
                      {effectiveStock <= 5 ? `Only ${effectiveStock} left!` : `${effectiveStock} in stock`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-500">
                    <span className="w-2 h-2 bg-red-500 rounded-full inline-block" />
                    <span className="font-medium text-sm">Out of stock</span>
                  </div>
                )}
              </div>

              {product.short_description && (
                <p className="text-gray-600 mb-5 text-sm leading-relaxed">{product.short_description}</p>
              )}

              {product.description && (
                <p className="text-gray-600 mb-5 leading-relaxed text-sm">{product.description}</p>
              )}

              {Object.entries(variantGroups).map(([groupName, groupVariants]) => (
                <div key={groupName} className="mb-5">
                  <p className="font-semibold text-sm text-gray-700 mb-2">{groupName}:</p>
                  <div className="flex flex-wrap gap-2">
                    {groupVariants.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(prev => prev?.id === v.id ? null : v)}
                        disabled={v.stock_quantity === 0}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition ${
                          v.stock_quantity === 0
                            ? 'border-gray-200 text-gray-300 cursor-not-allowed line-through'
                            : selectedVariant?.id === v.id
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-300 text-gray-700 hover:border-orange-400'
                        }`}
                      >
                        {v.variant_value}
                        {v.price_adjustment !== 0 && v.price_adjustment != null && (
                          <span className="ml-1 text-xs text-gray-500">
                            ({v.price_adjustment > 0 ? '+' : ''}₹{v.price_adjustment})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-4 mb-6">
                <span className="font-medium text-sm text-gray-700">Qty:</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition font-bold"
                  >−</button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[50px] text-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(effectiveStock, q + 1))}
                    disabled={effectiveStock === 0}
                    className="px-4 py-2 hover:bg-gray-100 transition font-bold disabled:opacity-30"
                  >+</button>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={effectiveStock === 0}
                  className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  {effectiveStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button
                  onClick={toggleWishlist}
                  disabled={wishlistLoading}
                  className="p-3 border-2 border-gray-300 rounded-lg hover:border-orange-500 transition"
                  title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {inWishlist
                    ? <HeartSolid className="w-6 h-6 text-red-500" />
                    : <HeartIcon className="w-6 h-6 text-gray-500 hover:text-red-500 transition" />
                  }
                </button>
              </div>

              <div className="border-t pt-5">
                <h3 className="font-semibold text-base mb-3 text-gray-900">Product Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {product.brand && (
                    <div><span className="text-gray-500">Brand:</span><span className="ml-2 font-medium text-gray-900">{product.brand}</span></div>
                  )}
                  {product.categories && (
                    <div><span className="text-gray-500">Category:</span><span className="ml-2 font-medium text-gray-900">{product.categories.name}</span></div>
                  )}
                  {product.sku && (
                    <div><span className="text-gray-500">SKU:</span><span className="ml-2 font-medium text-gray-900">{product.sku}</span></div>
                  )}
                  {product.condition && (
                    <div><span className="text-gray-500">Condition:</span><span className="ml-2 font-medium text-gray-900 capitalize">{product.condition}</span></div>
                  )}
                  {product.warranty_period && (
                    <div><span className="text-gray-500">Warranty:</span><span className="ml-2 font-medium text-gray-900">{product.warranty_period}</span></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t pt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Customer Reviews
                {reviewStats.count > 0 && (
                  <span className="ml-3 text-base font-normal text-gray-500">({reviewStats.count})</span>
                )}
              </h3>
              {reviewStats.count > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating value={reviewStats.avg} size="md" />
                  <span className="font-bold text-gray-900">{reviewStats.avg}</span>
                  <span className="text-gray-500 text-sm">/ 5</span>
                </div>
              )}
            </div>

            {reviewsLoading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl">
                <p className="text-gray-400 text-lg">No reviews yet</p>
                <p className="text-gray-300 text-sm mt-1">Be the first to review this product</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        {review.profiles?.avatar_url ? (
                          <img src={review.profiles.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <span className="text-orange-600 font-bold text-sm">
                            {(review.profiles?.full_name || 'A')[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <p className="font-semibold text-sm text-gray-900">
                            {review.profiles?.full_name || 'Anonymous'}
                          </p>
                          <div className="flex items-center gap-2">
                            {review.is_verified_purchase && (
                              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                                ✓ Verified
                              </span>
                            )}
                            <span className="text-xs text-gray-400">{timeAgo(review.created_at)}</span>
                          </div>
                        </div>
                        <StarRating value={review.rating} size="sm" />
                        {review.title && (
                          <p className="font-semibold text-gray-900 mt-1 text-sm">{review.title}</p>
                        )}
                        <p className="text-gray-600 text-sm mt-1 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {user && !userHasReviewed && (
              <ReviewForm
                productId={id}
                user={user}
                onSubmitted={() => { fetchReviews(); setUserHasReviewed(true) }}
              />
            )}
            {user && userHasReviewed && (
              <p className="text-sm text-gray-500 text-center mt-6 bg-gray-50 rounded-lg py-3">
                ✓ You've already reviewed this product
              </p>
            )}
            {!user && (
              <p className="text-sm text-gray-500 text-center mt-6 bg-gray-50 rounded-lg py-3">
                <Link to="/login" className="text-orange-600 font-semibold hover:underline">Sign in</Link> to write a review
              </p>
            )}
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-12 border-t pt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedProducts.map(p => {
                  const img = p.product_images?.find(i => i.is_primary) || p.product_images?.[0]
                  return (
                    <Link
                      key={p.id}
                      to={`/products/${p.id}`}
                      className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden"
                    >
                      <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                        {img ? (
                          <img
                            src={img.image_url}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                          />
                        ) : null}
                        <div style={{ display: img ? 'none' : 'flex' }} className="w-full h-full items-center justify-center text-4xl">🛍️</div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-orange-600 transition">{p.name}</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">
                          ₹{parseFloat(p.discount_price || p.price).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}