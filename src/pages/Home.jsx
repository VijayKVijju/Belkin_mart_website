/*

import { Link } from 'react-router-dom'

export default function Home() {
  const categories = [
    { name: 'Mobiles', icon: '📱', slug: 'mobiles' },
    { name: 'Fashion', icon: '👗', slug: 'fashion' },
    { name: 'Electronics', icon: '💻', slug: 'electronics' },
    { name: 'Home & Kitchen', icon: '🏠', slug: 'home-kitchen' },
    { name: 'Beauty', icon: '💄', slug: 'beauty' },
    { name: 'Appliances', icon: '🔌', slug: 'appliances' },
    { name: 'Books', icon: '📚', slug: 'books' },
    { name: 'Toys & Games', icon: '🎮', slug: 'toys' },
    { name: 'Sports', icon: '⚽', slug: 'sports' },
    { name: 'Grocery', icon: '🛒', slug: 'grocery' },
    { name: 'Health', icon: '💊', slug: 'health' },
    { name: 'Automotive', icon: '🚗', slug: 'automotive' },
  ]

  const featuredProducts = [
    { id: 1, name: 'Wireless Headphones', price: 2999, image: '🎧', rating: 4.5 },
    { id: 2, name: 'Smart Watch', price: 4999, image: '⌚', rating: 4.3 },
    { id: 3, name: 'Laptop Backpack', price: 1499, image: '🎒', rating: 4.7 },
    { id: 4, name: 'Running Shoes', price: 3499, image: '👟', rating: 4.6 },
    { id: 5, name: 'Coffee Maker', price: 5999, image: '☕', rating: 4.4 },
    { id: 6, name: 'Yoga Mat', price: 899, image: '🧘', rating: 4.8 },
    { id: 7, name: 'Gaming Mouse', price: 1999, image: '🖱️', rating: 4.5 },
    { id: 8, name: 'Desk Lamp', price: 1299, image: '💡', rating: 4.2 },
    { id: 9, name: 'Water Bottle', price: 499, image: '🍶', rating: 4.6 },
    { id: 10, name: 'Phone Case', price: 299, image: '📱', rating: 4.3 },
  ]

  const deals = [
    { title: 'Electronics Sale', discount: '50% OFF', color: 'from-blue-500 to-blue-700' },
    { title: 'Fashion Week', discount: '40% OFF', color: 'from-pink-500 to-pink-700' },
    { title: 'Home Essentials', discount: '30% OFF', color: 'from-green-500 to-green-700' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <section className="relative bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🎉 Limited Time Offer
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
              END OF SEASON<br />SALE
            </h1>
            <p className="text-2xl md:text-4xl font-bold mb-2">Save on Fashion</p>
            <p className="text-xl md:text-3xl mb-8 text-white/90">up to 50% off</p>
            <Link
              to="/products"
              className="inline-block bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-2xl"
            >
              Shop Now →
            </Link>
          </div>
        </div>
      </section>

      {}
      <section className="bg-amber-50 py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-center gap-3 p-4">
              <div className="text-3xl">📦</div>
              <div>
                <p className="font-bold text-gray-900">7 Days Easy Returns</p>
                <p className="text-sm text-gray-600">Hassle-free returns</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4">
              <div className="text-3xl">💰</div>
              <div>
                <p className="font-bold text-gray-900">Cash on Delivery</p>
                <p className="text-sm text-gray-600">Pay when you receive</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4">
              <div className="text-3xl">✅</div>
              <div>
                <p className="font-bold text-gray-900">Trusted by Millions</p>
                <p className="text-sm text-gray-600">Safe & secure shopping</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {deals.map((deal, idx) => (
              <Link
                key={idx}
                to="/products"
                className={`bg-gradient-to-r ${deal.color} text-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition`}
              >
                <h3 className="text-2xl font-bold mb-2">{deal.title}</h3>
                <p className="text-4xl font-black mb-4">{deal.discount}</p>
                <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg font-semibold">
                  Shop Now →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Categories</h2>
            <p className="text-gray-600">Choose a category to explore products</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/products?category=${category.slug}`}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition">
                  <div className="text-5xl mb-3 text-center">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition text-sm text-center">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Featured Products</h2>
            <p className="text-gray-600">Check out our top picks for you</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition"
              >
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-xl flex items-center justify-center text-6xl">
                  {product.image}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-orange-600 transition">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400 text-sm">⭐</span>
                    <span className="text-xs text-gray-600">{product.rating}</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-block bg-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-lg"
            >
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated!</h2>
          <p className="text-xl mb-8 text-white/90">Subscribe to get special offers and updates</p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Shop With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="font-bold text-xl mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick shipping to your doorstep</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="font-bold text-xl mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure transactions</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="font-bold text-xl mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive pricing guaranteed</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="font-bold text-xl mb-2">24/7 Support</h3>
              <p className="text-gray-600">Always here to help you</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
  */

/*

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const CATEGORY_ICONS = {
  'mobiles': '📱', 'mobile-phones': '📱', 'mobiles-refurbished': '📱',
  'fashion': '👗', 'fashion-beauty': '👗', 'fashion-clothing': '👗',
  'electronics': '💻', 'electronics-appliances': '💻',
  'home-decor': '🏠', 'home-kitchen': '🏠', 'furnishing': '🛋️', 'furniture': '🪑',
  'makeup': '💄', 'beauty': '💄', 'skin-care': '🧴', 'hair-care': '💇',
  'home-appliances': '🔌', 'kitchen-appliances': '🔌',
  'books-stationery': '📚', 'books': '📚',
  'toys-gifts-baby-care': '🎮', 'toys': '🧸', 'toys-boys': '🎮', 'toys-girls': '🎀',
  'sports-fitness': '⚽', 'sports': '⚽',
  'food-supplements': '🛒', 'grocery': '🛒',
  'organic-products': '🌿', 'herbal-products': '🌿',
  'baby-care': '👶', 'diapers': '🍼',
  'apparel-footwear': '👕', 'mens-apparel': '👔', 'womens-apparel': '👗', 'kids-wear': '🧒',
  'mens-footwear': '👞', 'womens-footwear': '👠', 'kids-footwear': '👟',
  'laptops-computers': '💻', 'tablets-ipad': '📲',
  'smart-watches': '⌚', 'watches-clocks': '🕐',
  'audio-headphones': '🎧', 'cameras': '📷',
  'lighting': '💡', 'decor': '🪞',
  'sweets': '🍬', 'chocolates': '🍫', 'dry-fruits-nuts': '🥜',
  'gifts': '🎁', 'religious-items': '🪔',
  'kitchen-dining': '🍽️', 'cooking-ware': '🍳',
  'designer-fashion': '✨', 'mehndi-tattoos': '🌸',
  'electronic-accessories': '🔋', 'chargers-cables': '🔌',
  'default': '🛍️'
}

const DEAL_COLORS = [
  'from-blue-500 to-blue-700',
  'from-pink-500 to-pink-700',
  'from-green-500 to-green-700',
  'from-purple-500 to-purple-700',
  'from-orange-500 to-orange-700',
]

function getCategoryIcon(slug) {
  return CATEGORY_ICONS[slug] || CATEGORY_ICONS['default']
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-t-xl" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  )
}

function CategorySkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md animate-pulse">
      <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3" />
      <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto" />
    </div>
  )
}

export default function Home() {
  const [categories, setCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [deals, setDeals] = useState([])
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loadingCats, setLoadingCats] = useState(true)
  const [loadingProds, setLoadingProds] = useState(true)

  useEffect(() => {
    fetchCategories()
    fetchFeaturedProducts()
  }, [])

  const fetchCategories = async () => {
    setLoadingCats(true)
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, parent_id')
        .eq('is_active', true)
        .is('parent_id', null)
        .order('name')
        .limit(12)

      if (error) throw error

      const mapped = (data || []).map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        icon: getCategoryIcon(cat.slug),
      }))
      setCategories(mapped)

      const dealCats = (data || [])
        .filter(c => ['electronics-appliances', 'fashion-beauty', 'apparel-footwear', 'home-decor', 'food-supplements'].includes(c.slug))
        .slice(0, 3)
        .map((cat, i) => ({
          title: cat.name,
          discount: ['50% OFF', '40% OFF', '30% OFF'][i] || '20% OFF',
          color: DEAL_COLORS[i % DEAL_COLORS.length],
          slug: cat.slug,
        }))

      if (dealCats.length < 3) {
        const fallback = [
          { title: 'Electronics Sale', discount: '50% OFF', color: DEAL_COLORS[0], slug: 'electronics-appliances' },
          { title: 'Fashion Week', discount: '40% OFF', color: DEAL_COLORS[1], slug: 'fashion-beauty' },
          { title: 'Home Essentials', discount: '30% OFF', color: DEAL_COLORS[2], slug: 'home-decor' },
        ]
        setDeals(dealCats.length === 0 ? fallback : [...dealCats, ...fallback.slice(dealCats.length)])
      } else {
        setDeals(dealCats)
      }
    } catch (err) {
      console.error('fetchCategories error:', err.message)
      setCategories([
        { name: 'Mobiles', icon: '📱', slug: 'mobiles' },
        { name: 'Fashion', icon: '👗', slug: 'fashion' },
        { name: 'Electronics', icon: '💻', slug: 'electronics' },
        { name: 'Home & Kitchen', icon: '🏠', slug: 'home-kitchen' },
        { name: 'Beauty', icon: '💄', slug: 'beauty' },
        { name: 'Appliances', icon: '🔌', slug: 'appliances' },
        { name: 'Books', icon: '📚', slug: 'books' },
        { name: 'Toys & Games', icon: '🎮', slug: 'toys' },
        { name: 'Sports', icon: '⚽', slug: 'sports' },
        { name: 'Grocery', icon: '🛒', slug: 'grocery' },
        { name: 'Health', icon: '💊', slug: 'health' },
        { name: 'Automotive', icon: '🚗', slug: 'automotive' },
      ])
      setDeals([
        { title: 'Electronics Sale', discount: '50% OFF', color: DEAL_COLORS[0], slug: 'electronics' },
        { title: 'Fashion Week', discount: '40% OFF', color: DEAL_COLORS[1], slug: 'fashion' },
        { title: 'Home Essentials', discount: '30% OFF', color: DEAL_COLORS[2], slug: 'home-kitchen' },
      ])
    } finally {
      setLoadingCats(false)
    }
  }

  const fetchFeaturedProducts = async () => {
    setLoadingProds(true)
    try {
      // Try featured products first
      const { data: featured } = await supabase
        .from('products')
        .select('id, name, price, discount_price, categories(name, slug)')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(10)

      // If no featured products, fall back to latest active products
      let prods = featured && featured.length > 0 ? featured : []

      if (prods.length === 0) {
        const { data: latest } = await supabase
          .from('products')
          .select('id, name, price, discount_price, categories(name, slug)')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(10)
        prods = latest || []
      }

      if (prods.length === 0) {
        setFeaturedProducts([])
        return
      }

      // Load primary images for all products in one query
      const ids = prods.map(p => p.id)
      const { data: images } = await supabase
        .from('product_images')
        .select('product_id, image_url, is_primary, display_order')
        .in('product_id', ids)
        .order('display_order')

      // Build image map — prefer is_primary, fallback to first image found
      const imageMap = {}
      if (images) {
        images.forEach(img => {
          if (!imageMap[img.product_id] || img.is_primary) {
            imageMap[img.product_id] = img.image_url
          }
        })
      }

      const mapped = prods.map(p => ({
        id: p.id,
        name: p.name,
        price: parseFloat(p.price) || 0,
        discount_price: p.discount_price ? parseFloat(p.discount_price) : null,
        image: imageMap[p.id] || null,
        category: p.categories?.name || '',
        categorySlug: p.categories?.slug || '',
      }))

      setFeaturedProducts(mapped)
    } catch (err) {
      console.error('fetchFeaturedProducts error:', err.message)
      setFeaturedProducts([])
    } finally {
      setLoadingProds(false)
    }
  }

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) return
    try {
      await supabase.from('newsletter_subscribers').insert({ email, subscribed_at: new Date().toISOString() })
    } catch {}
    setSubscribed(true)
    setEmail('')
  }

  const discountPct = (price, discountPrice) =>
    discountPrice ? Math.round(((price - discountPrice) / price) * 100) : null

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🎉 Limited Time Offer
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
              END OF SEASON<br />SALE
            </h1>
            <p className="text-2xl md:text-4xl font-bold mb-2">Save on Fashion</p>
            <p className="text-xl md:text-3xl mb-8 text-white/90">up to 50% off</p>
            <Link
              to="/products"
              className="inline-block bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-2xl"
            >
              Shop Now →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-amber-50 py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '📦', title: '7 Days Easy Returns', sub: 'Hassle-free returns' },
              { icon: '💰', title: 'Cash on Delivery', sub: 'Pay when you receive' },
              { icon: '✅', title: 'Trusted by Millions', sub: 'Safe & secure shopping' },
            ].map((badge) => (
              <div key={badge.title} className="flex items-center justify-center gap-3 p-4">
                <div className="text-3xl">{badge.icon}</div>
                <div>
                  <p className="font-bold text-gray-900">{badge.title}</p>
                  <p className="text-sm text-gray-600">{badge.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {deals.map((deal, idx) => (
              <Link
                key={idx}
                to={`/products?category=${deal.slug || ''}`}
                className={`bg-gradient-to-r ${deal.color} text-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition`}
              >
                <h3 className="text-2xl font-bold mb-2">{deal.title}</h3>
                <p className="text-4xl font-black mb-4">{deal.discount}</p>
                <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg font-semibold">
                  Shop Now →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Categories</h2>
            <p className="text-gray-600">Choose a category to explore products</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loadingCats
              ? Array.from({ length: 12 }).map((_, i) => <CategorySkeleton key={i} />)
              : categories.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/products?category=${category.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition">
                      <div className="text-5xl mb-3 text-center">{category.icon}</div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition text-sm text-center">
                        {category.name}
                      </h3>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Featured Products</h2>
            <p className="text-gray-600">Check out our top picks for you</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {loadingProds
              ? Array.from({ length: 10 }).map((_, i) => <ProductSkeleton key={i} />)
              : featuredProducts.length === 0
              ? (
                <div className="col-span-full text-center py-16">
                  <p className="text-gray-400 text-lg">No featured products yet.</p>
                  <p className="text-gray-300 text-sm mt-1">Mark products as featured in your vendor dashboard.</p>
                </div>
              )
              : featuredProducts.map((product) => {
                  const pct = discountPct(product.price, product.discount_price)
                  return (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition"
                    >
                      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-xl flex items-center justify-center overflow-hidden relative">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            onError={e => {
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
                        {pct && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            -{pct}%
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-orange-600 transition">
                          {product.name}
                        </h3>
                        {product.category && (
                          <p className="text-[10px] text-gray-400 mb-1">{product.category}</p>
                        )}
                        <div className="flex items-center gap-2">
                          {product.discount_price ? (
                            <>
                              <p className="text-base font-bold text-gray-900">
                                ₹{product.discount_price.toLocaleString('en-IN')}
                              </p>
                              <p className="text-xs text-gray-400 line-through">
                                ₹{product.price.toLocaleString('en-IN')}
                              </p>
                            </>
                          ) : (
                            <p className="text-base font-bold text-gray-900">
                              ₹{product.price.toLocaleString('en-IN')}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
          </div>
          {!loadingProds && featuredProducts.length > 0 && (
            <div className="text-center mt-10">
              <Link
                to="/products"
                className="inline-block bg-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-lg"
              >
                View All Products →
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated!</h2>
          <p className="text-xl mb-8 text-white/90">Subscribe to get special offers and updates</p>
          {subscribed ? (
            <div className="max-w-md mx-auto bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
              <p className="font-bold text-lg">🎉 Thank you for subscribing!</p>
              <p className="text-white/80 text-sm mt-1">We'll keep you updated with the best deals.</p>
            </div>
          ) : (
            <div className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                onClick={handleSubscribe}
                className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                Subscribe
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Shop With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: '🚚', title: 'Fast Delivery', desc: 'Quick shipping to your doorstep' },
              { icon: '💳', title: 'Secure Payment', desc: '100% secure transactions' },
              { icon: '🎁', title: 'Best Prices', desc: 'Competitive pricing guaranteed' },
              { icon: '💬', title: '24/7 Support', desc: 'Always here to help you' },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
  */

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const CATEGORY_ICONS = {
  'mobiles': '📱', 'mobile-phones': '📱', 'mobiles-refurbished': '📱',
  'fashion': '👗', 'fashion-beauty': '👗', 'fashion-clothing': '👗',
  'electronics': '💻', 'electronics-appliances': '💻',
  'home-decor': '🏠', 'home-kitchen': '🏠', 'furnishing': '🛋️', 'furniture': '🪑',
  'makeup': '💄', 'beauty': '💄', 'skin-care': '🧴', 'hair-care': '💇',
  'home-appliances': '🔌', 'kitchen-appliances': '🔌',
  'books-stationery': '📚', 'books': '📚',
  'toys-gifts-baby-care': '🎮', 'toys': '🧸', 'toys-boys': '🎮', 'toys-girls': '🎀',
  'sports-fitness': '⚽', 'sports': '⚽',
  'food-supplements': '🛒', 'grocery': '🛒',
  'organic-products': '🌿', 'herbal-products': '🌿',
  'baby-care': '👶', 'diapers': '🍼',
  'apparel-footwear': '👕', 'mens-apparel': '👔', 'womens-apparel': '👗', 'kids-wear': '🧒',
  'mens-footwear': '👞', 'womens-footwear': '👠', 'kids-footwear': '👟',
  'laptops-computers': '💻', 'tablets-ipad': '📲',
  'smart-watches': '⌚', 'watches-clocks': '🕐',
  'audio-headphones': '🎧', 'cameras': '📷',
  'lighting': '💡', 'decor': '🪞',
  'sweets': '🍬', 'chocolates': '🍫', 'dry-fruits-nuts': '🥜',
  'gifts': '🎁', 'religious-items': '🪔',
  'kitchen-dining': '🍽️', 'cooking-ware': '🍳',
  'designer-fashion': '✨', 'mehndi-tattoos': '🌸',
  'electronic-accessories': '🔋', 'chargers-cables': '🔌',
  'default': '🛍️'
}

const DEAL_COLORS = [
  'from-blue-500 to-blue-700',
  'from-pink-500 to-pink-700',
  'from-green-500 to-green-700',
  'from-purple-500 to-purple-700',
  'from-orange-500 to-orange-700',
]

const DEAL_DISCOUNTS = ['50% OFF', '40% OFF', '30% OFF', '25% OFF', '20% OFF']

const PRIORITY_DEAL_SLUGS = [
  'electronics-appliances', 'fashion-beauty', 'apparel-footwear',
  'home-decor', 'food-supplements', 'mobiles', 'sports-fitness'
]

function getCategoryIcon(slug) {
  return CATEGORY_ICONS[slug] || CATEGORY_ICONS['default']
}

const debugLog = (label, data, isError = false) => {
  if (isError) {
    console.error(`[HOME ERROR] ${label}:`, data)
  } else {
    console.log(`[HOME] ${label}:`, data)
  }
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-t-xl" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  )
}

function CategorySkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md animate-pulse">
      <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3" />
      <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto" />
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

export default function Home() {
  const [categories, setCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [deals, setDeals] = useState([])
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loadingCats, setLoadingCats] = useState(true)
  const [loadingProds, setLoadingProds] = useState(true)
  const [catError, setCatError] = useState(null)
  const [prodError, setProdError] = useState(null)
  const [subError, setSubError] = useState(null)
  const [subLoading, setSubLoading] = useState(false)
  const [catRetry, setCatRetry] = useState(0)
  const [prodRetry, setProdRetry] = useState(0)

  const catFetchingRef = useRef(false)
  const prodFetchingRef = useRef(false)

  useEffect(() => {
    if (catFetchingRef.current) return
    catFetchingRef.current = true

    let cancelled = false

    const run = async () => {
      setLoadingCats(true)
      setCatError(null)
      debugLog('fetchCategories', 'Starting...')

      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, parent_id, image_url, display_order')
        .eq('is_active', true)
        .is('parent_id', null)
        .order('display_order', { ascending: true })
        .limit(12)

      if (cancelled) { catFetchingRef.current = false; return }

      if (error) {
        debugLog('fetchCategories', { code: error.code, message: error.message, details: error.details, hint: error.hint }, true)
        setCatError(`[${error.code}] ${error.message}`)
        setLoadingCats(false)
        catFetchingRef.current = false
        return
      }

      debugLog('fetchCategories', `Got ${data?.length ?? 0} categories`)

      const mapped = (data || []).map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image_url: cat.image_url || null,
        icon: getCategoryIcon(cat.slug),
      }))

      const dealPool = (data || []).filter(c => PRIORITY_DEAL_SLUGS.includes(c.slug))
      const remaining = (data || []).filter(c => !PRIORITY_DEAL_SLUGS.includes(c.slug))
      const combined = [...dealPool, ...remaining].slice(0, 3)

      const builtDeals = combined.length > 0
        ? combined.map((cat, i) => ({
            title: cat.name,
            discount: DEAL_DISCOUNTS[i] || '20% OFF',
            color: DEAL_COLORS[i % DEAL_COLORS.length],
            slug: cat.slug,
          }))
        : [
            { title: 'Electronics Sale', discount: '50% OFF', color: DEAL_COLORS[0], slug: 'electronics-appliances' },
            { title: 'Fashion Week', discount: '40% OFF', color: DEAL_COLORS[1], slug: 'fashion-beauty' },
            { title: 'Home Essentials', discount: '30% OFF', color: DEAL_COLORS[2], slug: 'home-decor' },
          ]

      if (!cancelled) {
        setCategories(mapped)
        setDeals(builtDeals)
        setLoadingCats(false)
      }
      catFetchingRef.current = false
    }

    run()
    return () => { cancelled = true; catFetchingRef.current = false }
  }, [catRetry])

  useEffect(() => {
    if (prodFetchingRef.current) return
    prodFetchingRef.current = true

    let cancelled = false

    const run = async () => {
      setLoadingProds(true)
      setProdError(null)
      debugLog('fetchFeaturedProducts', 'Starting...')

      const { data: featured, error: featuredErr } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          discount_price,
          category_id,
          categories(id, name, slug)
        `)
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(10)

      if (cancelled) { prodFetchingRef.current = false; return }

      if (featuredErr) {
        debugLog('fetchFeaturedProducts [featured]', { code: featuredErr.code, message: featuredErr.message, details: featuredErr.details, hint: featuredErr.hint }, true)
      }

      let prods = featured && featured.length > 0 ? featured : []
      debugLog('fetchFeaturedProducts [featured]', `Got ${prods.length}`)

      if (prods.length === 0) {
        debugLog('fetchFeaturedProducts', 'Falling back to latest active products...')

        const { data: latest, error: latestErr } = await supabase
          .from('products')
          .select(`
            id,
            name,
            price,
            discount_price,
            category_id,
            categories(id, name, slug)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(10)

        if (cancelled) { prodFetchingRef.current = false; return }

        if (latestErr) {
          debugLog('fetchFeaturedProducts [latest]', { code: latestErr.code, message: latestErr.message, details: latestErr.details, hint: latestErr.hint }, true)
          setProdError(`[${latestErr.code}] ${latestErr.message}`)
          setLoadingProds(false)
          prodFetchingRef.current = false
          return
        }

        prods = latest || []
        debugLog('fetchFeaturedProducts [latest]', `Got ${prods.length}`)
      }

      if (prods.length === 0) {
        setFeaturedProducts([])
        setLoadingProds(false)
        prodFetchingRef.current = false
        return
      }

      const ids = prods.map(p => p.id)
      debugLog('fetchFeaturedProducts [images]', `Fetching images for ${ids.length} product(s)`)

      const { data: images, error: imgErr } = await supabase
        .from('product_images')
        .select('product_id, image_url, is_primary, display_order')
        .in('product_id', ids)
        .order('display_order', { ascending: true })

      if (cancelled) { prodFetchingRef.current = false; return }

      if (imgErr) {
        debugLog('fetchFeaturedProducts [images]', { code: imgErr.code, message: imgErr.message, details: imgErr.details, hint: imgErr.hint }, true)
      } else if (!images || images.length === 0) {
        debugLog('fetchFeaturedProducts [images]', 'Got 0 rows → Fix: Supabase Dashboard → Table Editor → product_images → RLS → New Policy → "Enable read access for all users" (SELECT, role: anon)', true)
      } else {
        debugLog('fetchFeaturedProducts [images]', `Got ${images.length} row(s)`)
      }

      const imageMap = {}
      if (images) {
        images.forEach(img => {
          if (!imageMap[img.product_id] || img.is_primary) {
            imageMap[img.product_id] = img.image_url
          }
        })
      }

      const mapped = prods.map(p => ({
        id: p.id,
        name: p.name,
        price: parseFloat(p.price) || 0,
        discount_price: p.discount_price ? parseFloat(p.discount_price) : null,
        image: imageMap[p.id] || null,
        category: p.categories?.name || '',
        categorySlug: p.categories?.slug || '',
      }))

      debugLog('fetchFeaturedProducts [done]', `${mapped.length} products, ${Object.keys(imageMap).length} with images`)

      if (!cancelled) {
        setFeaturedProducts(mapped)
        setLoadingProds(false)
      }
      prodFetchingRef.current = false
    }

    run()
    return () => { cancelled = true; prodFetchingRef.current = false }
  }, [prodRetry])

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      setSubError('Please enter a valid email address.')
      return
    }
    setSubLoading(true)
    setSubError(null)
    debugLog('handleSubscribe', `email=${email}`)

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email, subscribed_at: new Date().toISOString() })

    if (error) {
      debugLog('handleSubscribe', { code: error.code, message: error.message, details: error.details, hint: error.hint }, true)
      setSubError(error.code === '23505' ? 'This email is already subscribed.' : `[${error.code}] ${error.message}`)
      setSubLoading(false)
      return
    }

    debugLog('handleSubscribe', 'Success')
    setSubscribed(true)
    setEmail('')
    setSubLoading(false)
  }

  const discountPct = (price, discountPrice) =>
    discountPrice ? Math.round(((price - discountPrice) / price) * 100) : null

  return (
    <div className="min-h-screen bg-gray-50">

      <section className="relative bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🎉 Limited Time Offer
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
              END OF SEASON<br />SALE
            </h1>
            <p className="text-2xl md:text-4xl font-bold mb-2">Save on Fashion</p>
            <p className="text-xl md:text-3xl mb-8 text-white/90">up to 50% off</p>
            <Link
              to="/products"
              className="inline-block bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-2xl"
            >
              Shop Now →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-amber-50 py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '📦', title: '7 Days Easy Returns', sub: 'Hassle-free returns' },
              { icon: '💰', title: 'Cash on Delivery', sub: 'Pay when you receive' },
              { icon: '✅', title: 'Trusted by Millions', sub: 'Safe & secure shopping' },
            ].map((badge) => (
              <div key={badge.title} className="flex items-center justify-center gap-3 p-4">
                <div className="text-3xl">{badge.icon}</div>
                <div>
                  <p className="font-bold text-gray-900">{badge.title}</p>
                  <p className="text-sm text-gray-600">{badge.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          {catError && (
            <div className="mb-4">
              <ErrorBanner message={catError} onRetry={() => { catFetchingRef.current = false; setCatRetry(c => c + 1) }} />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loadingCats
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 animate-pulse rounded-2xl h-40" />
                ))
              : deals.map((deal, idx) => (
                  <Link
                    key={idx}
                    to={`/products?category=${deal.slug}`}
                    className={`bg-gradient-to-r ${deal.color} text-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition`}
                  >
                    <h3 className="text-2xl font-bold mb-2">{deal.title}</h3>
                    <p className="text-4xl font-black mb-4">{deal.discount}</p>
                    <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg font-semibold">
                      Shop Now →
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Categories</h2>
            <p className="text-gray-600">Choose a category to explore products</p>
          </div>
          {catError && !loadingCats && (
            <div className="mb-6">
              <ErrorBanner message={catError} onRetry={() => { catFetchingRef.current = false; setCatRetry(c => c + 1) }} />
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loadingCats
              ? Array.from({ length: 12 }).map((_, i) => <CategorySkeleton key={i} />)
              : categories.length > 0
              ? categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition">
                      {category.image_url ? (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="w-12 h-12 object-cover rounded-full mx-auto mb-3"
                          onError={e => {
                            debugLog('CategoryImage [onError]', `slug=${category.slug}`, true)
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'block'
                          }}
                        />
                      ) : null}
                      <div
                        className="text-5xl mb-3 text-center"
                        style={{ display: category.image_url ? 'none' : 'block' }}
                      >
                        {category.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition text-sm text-center">
                        {category.name}
                      </h3>
                    </div>
                  </Link>
                ))
              : !catError && (
                  <div className="col-span-full text-center py-8 text-gray-400">No categories available.</div>
                )}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Featured Products</h2>
            <p className="text-gray-600">Check out our top picks for you</p>
          </div>
          {prodError && !loadingProds && (
            <div className="mb-6">
              <ErrorBanner message={prodError} onRetry={() => { prodFetchingRef.current = false; setProdRetry(c => c + 1) }} />
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {loadingProds
              ? Array.from({ length: 10 }).map((_, i) => <ProductSkeleton key={i} />)
              : featuredProducts.length === 0
              ? (
                <div className="col-span-full text-center py-16">
                  <div className="text-6xl mb-4">🛍️</div>
                  <p className="text-gray-400 text-lg">No featured products yet.</p>
                  <p className="text-gray-300 text-sm mt-1">Mark products as featured in your vendor dashboard.</p>
                </div>
              )
              : featuredProducts.map((product) => {
                  const pct = discountPct(product.price, product.discount_price)
                  return (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition"
                    >
                      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-xl flex items-center justify-center overflow-hidden relative">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            onError={e => {
                              debugLog('ProductImage [onError]', `id=${product.id}`, true)
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
                        {pct && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            -{pct}%
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-orange-600 transition">
                          {product.name}
                        </h3>
                        {product.category && (
                          <p className="text-[10px] text-gray-400 mb-1">{product.category}</p>
                        )}
                        <div className="flex items-center gap-2">
                          {product.discount_price ? (
                            <>
                              <p className="text-base font-bold text-gray-900">
                                ₹{product.discount_price.toLocaleString('en-IN')}
                              </p>
                              <p className="text-xs text-gray-400 line-through">
                                ₹{product.price.toLocaleString('en-IN')}
                              </p>
                            </>
                          ) : (
                            <p className="text-base font-bold text-gray-900">
                              ₹{product.price.toLocaleString('en-IN')}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
          </div>
          {!loadingProds && featuredProducts.length > 0 && (
            <div className="text-center mt-10">
              <Link
                to="/products"
                className="inline-block bg-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-lg"
              >
                View All Products →
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated!</h2>
          <p className="text-xl mb-8 text-white/90">Subscribe to get special offers and updates</p>
          {subscribed ? (
            <div className="max-w-md mx-auto bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
              <p className="font-bold text-lg">🎉 Thank you for subscribing!</p>
              <p className="text-white/80 text-sm mt-1">We'll keep you updated with the best deals.</p>
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setSubError(null) }}
                  onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                  disabled={subLoading}
                />
                <button
                  onClick={handleSubscribe}
                  disabled={subLoading}
                  className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition disabled:opacity-60"
                >
                  {subLoading ? '...' : 'Subscribe'}
                </button>
              </div>
              {subError && <p className="text-red-200 text-sm font-medium">{subError}</p>}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Why Shop With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: '🚚', title: 'Fast Delivery', desc: 'Quick shipping to your doorstep' },
              { icon: '💳', title: 'Secure Payment', desc: '100% secure transactions' },
              { icon: '🎁', title: 'Best Prices', desc: 'Competitive pricing guaranteed' },
              { icon: '💬', title: '24/7 Support', desc: 'Always here to help you' },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}