import { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { supabase } from '../supabaseClient'

const debugLog = (label, data, isError = false) => {
  if (isError) {
    console.error(`[PRODUCTS ERROR] ${label}:`, data)
  } else {
    console.log(`[PRODUCTS] ${label}:`, data)
  }
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  )
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-red-500 text-xl">⚠️</span>
        <p className="text-red-700 text-sm font-medium">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg font-semibold transition"
        >
          Retry
        </button>
      )}
    </div>
  )
}

export default function Products() {
  const [searchParams] = useSearchParams()
  const categorySlug = searchParams.get('category')
  const subcategorySlug = searchParams.get('sub')
  const searchQuery = searchParams.get('search')

  const [products, setProducts] = useState([])
  const [categoryInfo, setCategoryInfo] = useState(null)
  const [sortBy, setSortBy] = useState('newest')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cartFeedback, setCartFeedback] = useState({})
  const [retryCount, setRetryCount] = useState(0)

  const fetchingRef = useRef(false)
  const addToCart = useCartStore((state) => state.addToCart)

  useEffect(() => {
    if (fetchingRef.current) return
    fetchingRef.current = true

    let cancelled = false

    const run = async () => {
      setLoading(true)
      setError(null)
      setCategoryInfo(null)

      debugLog('fetchProducts', `category=${categorySlug} sub=${subcategorySlug} search=${searchQuery} sort=${sortBy}`)

      let categoryId = null

      if (categorySlug) {
        const { data: catData, error: catErr } = await supabase
          .from('categories')
          .select('id, name, slug')
          .eq('slug', categorySlug)
          .eq('is_active', true)
          .maybeSingle()

        if (catErr) {
          debugLog('resolveCategoryId', { code: catErr.code, message: catErr.message, details: catErr.details, hint: catErr.hint }, true)
        } else if (catData) {
          categoryId = catData.id
          debugLog('resolveCategoryId', `"${categorySlug}" → id=${categoryId}`)
          if (!cancelled) setCategoryInfo(catData)
        } else {
          debugLog('resolveCategoryId', `Slug "${categorySlug}" not found in categories table`, true)
        }
      }

      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          discount_price,
          stock_quantity,
          condition,
          brand,
          created_at,
          category_id,
          categories(id, name, slug)
        `)
        .eq('is_active', true)

      if (categoryId) {
        query = query.eq('category_id', categoryId)
        debugLog('fetchProducts', `Filter → category_id=${categoryId}`)
      }

      if (searchQuery && searchQuery.trim() !== '') {
        query = query.ilike('name', `%${searchQuery.trim()}%`)
        debugLog('fetchProducts', `Filter → search="${searchQuery.trim()}"`)
      }

      if (sortBy === 'price_asc') {
        query = query.order('price', { ascending: true })
      } else if (sortBy === 'price_desc') {
        query = query.order('price', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error: queryErr } = await query

      if (cancelled) { fetchingRef.current = false; return }

      if (queryErr) {
        debugLog('fetchProducts [query]', { code: queryErr.code, message: queryErr.message, details: queryErr.details, hint: queryErr.hint }, true)
        setError(`[${queryErr.code}] ${queryErr.message}`)
        setLoading(false)
        fetchingRef.current = false
        return
      }

      debugLog('fetchProducts [query]', `Fetched ${data?.length ?? 0} products`)

      if (!data || data.length === 0) {
        setProducts([])
        setLoading(false)
        fetchingRef.current = false
        return
      }

      const ids = data.map(p => p.id)
      debugLog('fetchProducts [images]', `Fetching images for ${ids.length} product(s)`)

      const { data: images, error: imgErr } = await supabase
        .from('product_images')
        .select('product_id, image_url, is_primary, display_order')
        .in('product_id', ids)
        .order('display_order', { ascending: true })

      if (cancelled) { fetchingRef.current = false; return }

      if (imgErr) {
        debugLog('fetchProducts [images]', { code: imgErr.code, message: imgErr.message, details: imgErr.details, hint: imgErr.hint }, true)
      } else if (!images || images.length === 0) {
        debugLog('fetchProducts [images]', 'Got 0 rows → Go to Supabase Dashboard → Table Editor → product_images → RLS → Add policy: SELECT for role=anon (allow all)', true)
      } else {
        debugLog('fetchProducts [images]', `Got ${images.length} row(s)`)
      }

      const imageMap = {}
      if (images) {
        images.forEach(img => {
          if (!imageMap[img.product_id] || img.is_primary) {
            imageMap[img.product_id] = img.image_url
          }
        })
      }

      const mapped = data.map(p => ({
        id: p.id,
        name: p.name,
        price: parseFloat(p.price) || 0,
        discount_price: p.discount_price ? parseFloat(p.discount_price) : null,
        stock_quantity: p.stock_quantity ?? 0,
        condition: p.condition || '',
        brand: p.brand || '',
        category: p.categories?.name || '',
        categorySlug: p.categories?.slug || '',
        image: imageMap[p.id] || null,
      }))

      debugLog('fetchProducts [done]', `${mapped.length} products, ${Object.keys(imageMap).length} with images`)

      if (!cancelled) {
        setProducts(mapped)
        setLoading(false)
      }

      fetchingRef.current = false
    }

    run()

    return () => {
      cancelled = true
      fetchingRef.current = false
    }
  }, [categorySlug, subcategorySlug, searchQuery, sortBy, retryCount])

  const handleRetry = () => {
    fetchingRef.current = false
    setRetryCount(c => c + 1)
  }

  const handleAddToCart = (e, product) => {
    e.preventDefault()
    if (product.stock_quantity === 0) return
    debugLog('handleAddToCart', `id=${product.id} "${product.name}"`)
    addToCart(product, 1)
    setCartFeedback(prev => ({ ...prev, [product.id]: true }))
    setTimeout(() => setCartFeedback(prev => ({ ...prev, [product.id]: false })), 1500)
  }

  const breadcrumbLabel = categoryInfo?.name
    || (categorySlug ? categorySlug.replace(/-/g, ' ') : 'All Products')

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">

        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium capitalize">{breadcrumbLabel}</span>
            {subcategorySlug && (
              <>
                <span>/</span>
                <span className="text-gray-900 font-medium capitalize">
                  {subcategorySlug.replace(/-/g, ' ')}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-4">Filters</h3>
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
              {categoryInfo && (
                <div>
                  <h4 className="font-semibold mb-2 text-gray-700">Category</h4>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 text-sm font-medium text-orange-700 capitalize">
                    {categoryInfo.name}
                  </div>
                </div>
              )}
            </div>
          </aside>

          <div className="flex-1">

            {error && (
              <div className="mb-6">
                <ErrorBanner message={error} onRetry={handleRetry} />
              </div>
            )}

            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                {loading
                  ? 'Loading...'
                  : <><span className="font-semibold">{products.length}</span> product{products.length !== 1 ? 's' : ''}</>
                }
              </p>
              {searchQuery && !loading && (
                <p className="text-sm text-gray-500">
                  Results for: <span className="font-semibold text-gray-800">"{searchQuery}"</span>
                </p>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="group bg-white rounded-lg shadow hover:shadow-xl transition"
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-lg flex items-center justify-center overflow-hidden relative">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                          onError={e => {
                            debugLog('ProductImage [onError]', `id=${product.id} url=${product.image}`, true)
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-full items-center justify-center text-6xl"
                        style={{ display: product.image ? 'none' : 'flex' }}
                      >
                        🛍️
                      </div>
                      {product.stock_quantity === 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-t-lg">
                          <span className="text-white text-xs font-bold bg-black/60 px-2 py-1 rounded">Out of Stock</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-orange-600 transition">
                        {product.name}
                      </h3>
                      {product.brand && (
                        <p className="text-[10px] text-gray-400 mb-1">{product.brand}</p>
                      )}
                      {product.condition && product.condition !== 'new' && (
                        <span className="inline-block text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded capitalize mb-2">
                          {product.condition}
                        </span>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <div>
                          {product.discount_price ? (
                            <>
                              <p className="text-base font-bold text-gray-900">
                                ₹{product.discount_price.toLocaleString('en-IN')}
                              </p>
                              <p className="text-xs text-gray-500 line-through">
                                ₹{product.price.toLocaleString('en-IN')}
                              </p>
                            </>
                          ) : (
                            <p className="text-base font-bold text-gray-900">
                              ₹{product.price.toLocaleString('en-IN')}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={e => handleAddToCart(e, product)}
                          disabled={product.stock_quantity === 0}
                          className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${
                            product.stock_quantity === 0
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : cartFeedback[product.id]
                              ? 'bg-green-500 text-white'
                              : 'bg-orange-500 text-white hover:bg-orange-600'
                          }`}
                        >
                          {product.stock_quantity === 0 ? 'Out' : cartFeedback[product.id] ? '✓' : 'Add'}
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              !error && (
                <div className="text-center py-16 bg-white rounded-lg">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    {searchQuery
                      ? `No results for "${searchQuery}"`
                      : categorySlug
                      ? 'No products in this category yet.'
                      : 'No products available at the moment.'}
                  </p>
                  <Link to="/products" className="inline-block mt-2 text-orange-600 font-semibold hover:text-orange-700">
                    View All Products →
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}