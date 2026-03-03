
/*
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { 
  ShoppingCartIcon, 
  UserIcon, 
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  ChevronDownIcon,
  BuildingStorefrontIcon 
} from '@heroicons/react/24/outline'
import { useCartStore } from '../../store/cartStore'

// ✅ Logo is in /public/assets/images/ — served directly by Vite
const LOGO = '/assets/images/belkinmart-logo.png'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const getItemCount = useCartStore((state) => state.getItemCount)

  const mainCategories = [
    {
      name: 'Apparel & Footwear',
      slug: 'apparel-footwear',
      subcategories: [
        { name: "Men's Apparel", slug: 'mens-apparel' },
        { name: "Women's Apparel", slug: 'womens-apparel' },
        { name: 'Kids Wear', slug: 'kids-wear' },
      ]
    },
    {
      name: 'Electronics & Appliances',
      slug: 'electronics-appliances',
      subcategories: [
        { name: 'Mobiles', slug: 'mobiles' },
        { name: 'Laptops', slug: 'laptops' },
        { name: 'Tablets & iPad', slug: 'tablets' },
        { name: 'Smart Watches', slug: 'smart-watches' },
        { name: 'Home Appliances', slug: 'home-appliances' },
      ]
    },
    {
      name: 'Home & Decor',
      slug: 'home-decor',
      subcategories: [
        { name: 'Furnishing', slug: 'furnishing' },
        { name: 'Furniture', slug: 'furniture' },
        { name: 'Decor', slug: 'decor' },
      ]
    },
    {
      name: 'Food & Supplements',
      slug: 'food-supplements',
      subcategories: [
        { name: 'Grocery', slug: 'grocery' },
        { name: 'Organic Products', slug: 'organic' },
      ]
    },
    {
      name: 'Toys & Baby Care',
      slug: 'toys-baby-care',
      subcategories: [
        { name: 'Toys', slug: 'toys' },
        { name: 'Gifts', slug: 'gifts' },
        { name: 'Baby Care', slug: 'baby-care' },
      ]
    },
    {
      name: 'Fashion & Beauty',
      slug: 'fashion-beauty',
      subcategories: [
        { name: 'Makeup', slug: 'makeup' },
        { name: 'Hair Care', slug: 'hair-care' },
        { name: 'Skin Care', slug: 'skin-care' },
      ]
    },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">

        {}
        <div className="flex items-center justify-between h-16 gap-4">

          {}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            {}
            <img
              src={LOGO}
              alt="BelkinMart logo"
              className="h-11 w-auto object-contain"
            />
            {}
            <div className="hidden sm:flex items-stretch rounded overflow-hidden text-white font-extrabold text-xl leading-none shadow-sm">
              <span className="bg-[#1a237e] px-3 py-1.5 tracking-tight">Belkin</span>
              <span className="bg-[#c62828] px-3 py-1.5 tracking-tight">Mart</span>
            </div>
          </Link>

          {}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="w-full relative"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 transition"
              >
                🔍
              </button>
            </form>
          </div>

          {}
          <div className="flex items-center gap-4">

            {}
            <Link
              to="/vendor/dashboard"
              className="hidden lg:flex items-center gap-1 text-gray-700 hover:text-orange-600 transition"
              title="Seller Dashboard"
            >
              <BuildingStorefrontIcon className="w-6 h-6" />
              <span className="text-sm font-medium">Seller</span>
            </Link>

            {}
            <Link
              to="/login"
              className="hidden md:flex items-center gap-1 text-gray-700 hover:text-orange-600 transition"
            >
              <UserIcon className="w-6 h-6" />
              <span className="text-sm font-medium">Login</span>
            </Link>

            {}
            <Link
              to="/wishlist"
              className="hidden md:flex items-center gap-1 text-gray-700 hover:text-orange-600 transition"
            >
              <HeartIcon className="w-6 h-6" />
              <span className="text-sm font-medium">Wishlist</span>
            </Link>

            {}
            <Link
              to="/cart"
              className="flex items-center gap-1 text-gray-700 hover:text-orange-600 transition relative"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              <span className="hidden md:block text-sm font-medium">Cart</span>
              {getItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {getItemCount()}
                </span>
              )}
            </Link>

            {/}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen
                ? <XMarkIcon className="w-6 h-6" />
                : <Bars3Icon className="w-6 h-6" />
              }
            </button>
          </div>
        </div>

        {}
        <nav className="hidden md:flex items-center gap-6 py-3 border-t text-sm overflow-x-auto">
          {mainCategories.map((category) => (
            <div key={category.slug} className="relative group">
              <Link
                to={`/products?category=${category.slug}`}
                className="flex items-center gap-1 whitespace-nowrap text-gray-700 hover:text-orange-600 transition font-medium"
              >
                {category.name}
                <ChevronDownIcon className="w-4 h-4" />
              </Link>

              {}
              <div className="absolute left-0 top-full mt-2 bg-white shadow-xl rounded-xl p-3 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                {category.subcategories.map((sub) => (
                  <Link
                    key={sub.slug}
                    to={`/products?category=${category.slug}&sub=${sub.slug}`}
                    className="block py-2 px-3 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t max-h-[80vh] overflow-y-auto">

            {}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mb-4 relative"
            >
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 transition"
              >
                🔍
              </button>
            </form>

            {}
            {mainCategories.map((category) => (
              <div key={category.slug} className="mb-3">
                <Link
                  to={`/products?category=${category.slug}`}
                  className="block py-2 font-semibold text-gray-900 hover:text-orange-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
                <div className="pl-4 border-l-2 border-orange-100 ml-1">
                  {category.subcategories.map((sub) => (
                    <Link
                      key={sub.slug}
                      to={`/products?category=${category.slug}&sub=${sub.slug}`}
                      className="block py-1.5 text-sm text-gray-500 hover:text-orange-600 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {}
            <div className="border-t mt-4 pt-4 space-y-1">
              <Link
                to="/vendor/dashboard"
                className="flex items-center gap-2 py-2.5 px-2 text-orange-600 font-bold rounded-lg hover:bg-orange-50 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BuildingStorefrontIcon className="w-5 h-5" />
                Become a Seller
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 py-2.5 px-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserIcon className="w-5 h-5" />
                Account Login
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center gap-2 py-2.5 px-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <HeartIcon className="w-5 h-5" />
                Wishlist
              </Link>
              <Link
                to="/about"
                className="flex items-center gap-2 py-2.5 px-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
            </div>

          </div>
        )}

      </div>
    </header>
  )
}

*/

//=====================
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon,
  HeartIcon, ChevronDownIcon, BuildingStorefrontIcon
} from '@heroicons/react/24/outline'
import { supabase } from '../../supabaseClient'
import SearchBar from './SearchBar'

const LOGO = '/assets/images/belkinmart-logo.png'
const SESSION_DURATION_MS = 4 * 60 * 60 * 1000

const FALLBACK_NAV = [
  {
    name: 'APPAREL & FOOTWEAR', slug: 'apparel-footwear',
    columns: [
      { title: "Men's Apparel", slug: 'mens-apparel', items: [{ name: "Winter Wear", slug: 'mens-winter-wear' }, { name: "Summer Wear", slug: 'mens-summer-wear' }, { name: "Coat", slug: 'mens-coat' }, { name: "Blazer", slug: 'mens-blazer' }, { name: "Suit", slug: 'mens-suit' }, { name: "Pant", slug: 'mens-pant' }, { name: "Jeans", slug: 'jeans' }, { name: "Shirt", slug: 'mens-formal-shirt' }, { name: "T-Shirt", slug: 'mens-tshirt-half' }, { name: "Track Pant", slug: 'mens-track-pant' }, { name: "Bermuda", slug: 'mens-bermuda' }, { name: "Under Garments", slug: 'mens-under-garments' }] },
      { title: "Accessories & Shoes", slug: 'mens-accessories', items: [{ name: "Cap", slug: 'mens-cap' }, { name: "Handkerchief", slug: 'mens-handkerchief' }, { name: "Tie", slug: 'mens-tie' }, { name: "Belt", slug: 'mens-belt' }, { name: "Socks", slug: 'mens-socks' }, { name: "Formal Shoes", slug: 'mens-formal-shoes' }, { name: "Casual Shoes", slug: 'mens-casual-shoes' }, { name: "Sports Shoes", slug: 'mens-sports-shoes' }, { name: "Sandals", slug: 'mens-sandals' }, { name: "Slippers", slug: 'mens-slippers' }] },
      { title: "Women's Apparel", slug: 'womens-apparel', items: [{ name: "Party Wear Dresses", slug: 'party-wear-dresses' }, { name: "Western Wear", slug: 'western-wear' }, { name: "Lehenga", slug: 'lehenga' }, { name: "Designer Dresses", slug: 'womens-designer-dresses' }] },
      { title: "Kids Wear", slug: 'kids-wear', items: [{ name: "Seasonal Wear", slug: 'kids-seasonal-wear' }, { name: "Casual Wear", slug: 'kids-casual-wear' }, { name: "Formal Wear", slug: 'kids-formal-wear' }, { name: "Jeans", slug: 'kids-jeans' }, { name: "T-Shirts", slug: 'kids-tshirts' }, { name: "Track Pants", slug: 'kids-track-pants' }, { name: "Shoes", slug: 'kids-shoes' }] }
    ]
  },
  {
    name: 'ELECTRONICS & APPLIANCES', slug: 'electronics-appliances',
    columns: [
      { title: "Gadgets", slug: 'mobiles', items: [{ name: "Smart Phone", slug: 'smart-phones' }, { name: "Simple Phone", slug: 'simple-phones' }, { name: "Laptops", slug: 'laptops-computers' }, { name: "Tablets & iPad", slug: 'tablets-ipad' }, { name: "Smart Watches", slug: 'smart-watches' }, { name: "Watches & Clocks", slug: 'watches-clocks' }] },
      { title: "Home Appliances", slug: 'home-appliances', items: [{ name: "AC", slug: 'ac' }, { name: "Refrigerator", slug: 'refrigerator' }, { name: "Fan", slug: 'fan' }, { name: "Air Cooler", slug: 'air-cooler' }, { name: "Geyser", slug: 'geyser-electric' }, { name: "Microwave", slug: 'microwave' }, { name: "Air Fryer", slug: 'air-fryer' }, { name: "Mixer Grinder", slug: 'mixer-grinder' }, { name: "Kettle", slug: 'kettle' }] },
      { title: "TV & Computers", slug: 'tv-entertainment', items: [{ name: "LED TV", slug: 'tv-led' }, { name: "Smart TV", slug: 'tv-smart' }, { name: "Computer", slug: 'desktop-assembled' }] },
      { title: "Accessories & Lighting", slug: 'electronic-accessories', items: [{ name: "Charger", slug: 'chargers-cables' }, { name: "Earphone", slug: 'earphones' }, { name: "Pen Drive", slug: 'pen-drives-sd-cards' }, { name: "Hard Disk", slug: 'hard-disks' }, { name: "CCTV Camera", slug: 'cctv-cameras' }, { name: "LED Light", slug: 'led-lights' }, { name: "Solar Light", slug: 'solar-lights' }] }
    ]
  },
  {
    name: 'HOME & DECOR', slug: 'home-decor',
    columns: [
      { title: "Furnishing", slug: 'furnishing', items: [{ name: "Curtains & Blinds", slug: 'curtains-blinds' }, { name: "Bedsheets & Pillows", slug: 'bedsheets-pillows' }, { name: "Blankets & Quilts", slug: 'blankets-quilts' }, { name: "Mattresses", slug: 'mattresses' }] },
      { title: "Furniture", slug: 'furniture', items: [{ name: "Sofa Set", slug: 'sofa-sets' }, { name: "Bed", slug: 'beds' }, { name: "Dining Table", slug: 'dining-tables' }, { name: "Chairs", slug: 'chairs-stools' }, { name: "Outdoor Furniture", slug: 'outdoor-furniture' }] },
      { title: "Decor", slug: 'decor', items: [{ name: "Mirrors", slug: 'mirrors' }, { name: "Wallpapers", slug: 'wallpapers' }, { name: "Wall Scenery", slug: 'wall-scenery' }] }
    ]
  },
  {
    name: 'FOOD & SUPPLEMENTS', slug: 'food-supplements',
    columns: [
      { title: "Grocery", slug: 'grocery', items: [{ name: "Dry Fruits", slug: 'dry-fruits-nuts' }, { name: "Sweets", slug: 'sweets' }, { name: "Chocolates", slug: 'chocolates' }, { name: "Biscuits", slug: 'biscuits-cookies' }, { name: "Namkeen", slug: 'snacks-namkeen' }, { name: "Sugar Free", slug: 'sugar-free' }] },
      { title: "Organic Products", slug: 'organic-products', items: [{ name: "Organic Food", slug: 'organic-food' }, { name: "Organic Juice", slug: 'organic-juice' }, { name: "Aloe Vera Juice", slug: 'aloe-vera-juice' }, { name: "Herbal Powder", slug: 'herbal-products' }] },
      { title: "Others", slug: 'condiments', items: [{ name: "Honey", slug: 'honey' }, { name: "Sauce & Jams", slug: 'sauces-jams' }, { name: "Murabba", slug: 'murabba' }] }
    ]
  },
  {
    name: 'TOYS, GIFTS & BABY CARE', slug: 'toys-gifts-baby-care',
    columns: [
      { title: "Toys", slug: 'toys', items: [{ name: "Toys for Boys", slug: 'toys-boys' }, { name: "Toys for Girls", slug: 'toys-girls' }] },
      { title: "Gifts", slug: 'gifts', items: [{ name: "Bouquet & Flowers", slug: 'bouquets-flowers' }, { name: "Birthday Materials", slug: 'birthday-materials' }, { name: "Balloons", slug: 'balloons' }, { name: "Ceremony Material", slug: 'ceremony-material' }] },
      { title: "Religious & Kitchen", slug: 'religious-items', items: [{ name: "Murti & Idols", slug: 'murti-idols' }, { name: "Deepak & Bells", slug: 'deepak-bells' }, { name: "Dinner Sets", slug: 'dinner-glass-sets' }, { name: "Steel Utensils", slug: 'steel-utensils' }, { name: "Cooking Ware", slug: 'cooking-ware' }] },
      { title: "Baby Care", slug: 'baby-care', items: [{ name: "Diapers", slug: 'diapers' }, { name: "Baby Kit", slug: 'baby-kit' }, { name: "Baby Clothing", slug: 'baby-clothing' }, { name: "Feeders & Napkins", slug: 'feeders-napkins' }] }
    ]
  },
  {
    name: 'FASHION & BEAUTY', slug: 'fashion-beauty',
    columns: [
      { title: "Makeup", slug: 'makeup', items: [{ name: "Foundation", slug: 'face-products' }, { name: "Eyeliner", slug: 'eye-makeup' }, { name: "Lipstick", slug: 'lip-products' }, { name: "Face Pack", slug: 'face-products' }, { name: "Beauty Cream", slug: 'skin-treatments' }, { name: "Nail Paint", slug: 'nail-products' }] },
      { title: "Hair & Skin", slug: 'hair-care', items: [{ name: "Hair Gel & Spray", slug: 'hair-styling' }, { name: "Hair Colour", slug: 'hair-colour' }, { name: "Hair Straightener", slug: 'hair-treatment' }, { name: "Detan Cream", slug: 'detan-detox' }, { name: "Moisturizers", slug: 'moisturizers' }] },
      { title: "Mehndi & Designer", slug: 'mehndi-tattoos', items: [{ name: "Mehndi", slug: 'mehndi' }, { name: "Temporary Tattoos", slug: 'temporary-tattoos' }, { name: "Party Wear Designer", slug: 'party-wear-designer' }, { name: "Indian Designer Wear", slug: 'indian-designer-wear' }, { name: "Imported Fashion", slug: 'imported-fashion' }] }
    ]
  }
]

function buildNavFromSupabase(allCats) {
  const childrenOf = {}
  allCats.forEach(c => {
    if (c.parent_id) {
      if (!childrenOf[c.parent_id]) childrenOf[c.parent_id] = []
      childrenOf[c.parent_id].push(c)
    }
  })
  const level1 = allCats.filter(c => !c.parent_id)
  const nav = level1.map(main => {
    const level2 = childrenOf[main.id] || []
    const columns = level2.map(sub => {
      const level3 = childrenOf[sub.id] || []
      return { title: sub.name, slug: sub.slug, items: level3.map(c => ({ name: c.name, slug: c.slug })) }
    }).filter(col => col.items.length > 0)
    const finalColumns = columns.length > 0 ? columns : (
      level2.length > 0 ? [{ title: main.name, slug: main.slug, items: level2.map(c => ({ name: c.name, slug: c.slug })) }] : []
    )
    return { name: main.name.toUpperCase(), slug: main.slug, columns: finalColumns }
  }).filter(cat => cat.columns.length > 0)
  return nav
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
  return {
    id: userId,
    phone: localStorage.getItem('temp_user_phone') || '',
    name: localStorage.getItem('temp_user_name') || '',
  }
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileOpenCat, setMobileOpenCat] = useState(null)
  const [navigation, setNavigation] = useState([])
  const [navLoading, setNavLoading] = useState(true)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchNav()
    syncCart()
    syncAuth()

    window.addEventListener('cartUpdated', syncCart)
    window.addEventListener('storage', onStorage)
    window.addEventListener('userLoggedIn', syncAuth)
    window.addEventListener('wishlistUpdated', syncWishlist)

    return () => {
      window.removeEventListener('cartUpdated', syncCart)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('userLoggedIn', syncAuth)
      window.removeEventListener('wishlistUpdated', syncWishlist)
    }
  }, [])

  const syncCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartCount(cart.reduce((s, i) => s + (i.quantity || 1), 0))
    } catch { setCartCount(0) }
  }

  const onStorage = (e) => {
    if (e.key === 'cart') syncCart()
    if (e.key === 'temp_user_id') syncAuth()
  }

  const syncAuth = async () => {
    const session = readLocalSession()
    if (!session) {
      setIsLoggedIn(false)
      setUserName('')
      setWishlistCount(0)
      return
    }

    setIsLoggedIn(true)

    let displayName = session.name
    if (!displayName) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', session.id)
        .maybeSingle()
      displayName = profile?.full_name || `User ${session.phone.slice(-4)}`
      localStorage.setItem('temp_user_name', displayName)
    }
    setUserName(displayName)

    const { count } = await supabase
      .from('wishlist')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', session.id)
    setWishlistCount(count || 0)
  }

  const syncWishlist = async () => {
    const session = readLocalSession()
    if (!session) return
    const { count } = await supabase
      .from('wishlist')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', session.id)
    setWishlistCount(count || 0)
  }

  const fetchNav = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, parent_id')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
      if (error) { setNavigation(FALLBACK_NAV); return }
      if (data && data.length > 0) {
        const built = buildNavFromSupabase(data)
        setNavigation(built.length > 0 ? built : FALLBACK_NAV)
      } else {
        setNavigation(FALLBACK_NAV)
      }
    } catch {
      setNavigation(FALLBACK_NAV)
    } finally {
      setNavLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('temp_user_id')
    localStorage.removeItem('temp_user_phone')
    localStorage.removeItem('temp_user_name')
    localStorage.removeItem('temp_user_login_time')
    localStorage.removeItem('vendor_id')
    setIsLoggedIn(false)
    setUserName('')
    setWishlistCount(0)
    navigate('/')
  }

  const handleWishlistClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault()
      sessionStorage.setItem('login_return_to', '/wishlist')
      navigate('/login')
    }
  }

  const firstNameDisplay = userName
    ? userName.split(' ')[0].charAt(0).toUpperCase() + userName.split(' ')[0].slice(1)
    : ''

  const initials = userName
    ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">

        <div className="flex items-center justify-between h-16 gap-4">

          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img src={LOGO} alt="BelkinMart" className="h-10 w-auto" onError={e => { e.target.style.display = 'none' }} />
            <div className="hidden sm:flex items-stretch rounded overflow-hidden text-white font-extrabold text-lg">
              <span className="bg-[#1a237e] px-3 py-1">Belkin</span>
              <span className="bg-[#c62828] px-3 py-1">Mart</span>
            </div>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl">
            <SearchBar />
          </div>

          <div className="flex items-center gap-5 text-gray-700">

            <Link to="/vendor/dashboard" className="hidden lg:flex flex-col items-center hover:text-orange-600 transition">
              <BuildingStorefrontIcon className="w-5 h-5" />
              <span className="text-[10px] font-bold">SELLER</span>
            </Link>

            {isLoggedIn ? (
              <div className="relative group">
                <button className="flex flex-col items-center hover:text-orange-600 transition min-w-[48px]">
                  <div className="w-7 h-7 rounded-full bg-orange-500 text-white text-[11px] font-bold flex items-center justify-center">
                    {initials}
                  </div>
                  <span className="text-[10px] font-bold text-orange-600 truncate max-w-[56px] mt-0.5">
                    {firstNameDisplay || 'ACCOUNT'}
                  </span>
                </button>

                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-orange-50 border-b border-orange-100">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                  </div>
                  <Link to="/account" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition">👤 My Account</Link>
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition">📋 My Orders</Link>
                  <Link to="/wishlist" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition">
                    ❤️ Wishlist
                    {wishlistCount > 0 && (
                      <span className="ml-auto bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{wishlistCount}</span>
                    )}
                  </Link>
                  <div className="border-t border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex flex-col items-center hover:text-orange-600 transition">
                <UserIcon className="w-5 h-5" />
                <span className="text-[10px] font-bold">LOGIN</span>
              </Link>
            )}

            <Link
              to="/wishlist"
              onClick={handleWishlistClick}
              className="hidden md:flex flex-col items-center hover:text-orange-600 transition relative"
            >
              <HeartIcon className="w-5 h-5" />
              <span className="text-[10px] font-bold">WISHLIST</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="flex flex-col items-center hover:text-orange-600 transition relative">
              <ShoppingCartIcon className="w-5 h-5" />
              <span className="text-[10px] font-bold">CART</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
            </button>
          </div>
        </div>

        <nav className="hidden md:flex items-center justify-start gap-8 py-3 border-t overflow-x-auto scrollbar-none">
          {navLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-3 w-28 bg-gray-100 rounded-full animate-pulse flex-shrink-0" />
              ))
            : navigation.map(cat => (
                <div key={cat.slug} className="group static">
                  <button className="flex items-center gap-1 text-[11px] font-bold text-gray-800 hover:text-orange-600 uppercase tracking-tight whitespace-nowrap transition">
                    {cat.name}
                    <ChevronDownIcon className="w-3 h-3" />
                  </button>
                  {cat.columns.length > 0 && (
                    <div className="absolute left-0 w-full bg-white shadow-2xl border-t border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                      <div className={`container mx-auto grid gap-8 p-8 ${
                        cat.columns.length <= 2 ? 'grid-cols-2' :
                        cat.columns.length === 3 ? 'grid-cols-3' : 'grid-cols-4'
                      }`}>
                        {cat.columns.map((col, idx) => (
                          <div key={idx}>
                            <Link
                              to={`/products?category=${col.slug}`}
                              className="font-bold text-gray-900 mb-3 text-sm border-b pb-1 border-orange-100 block hover:text-orange-600 transition"
                            >
                              {col.title}
                            </Link>
                            <ul className="space-y-1.5">
                              {col.items.map(item => (
                                <li key={item.slug}>
                                  <Link
                                    to={`/products?category=${item.slug}`}
                                    className="text-gray-500 hover:text-orange-600 text-[13px] block transition-colors"
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
        </nav>
      </div>

      <div className="md:hidden px-4 pb-3 border-b">
        <SearchBar />
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60]" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-4/5 max-w-sm h-full bg-white overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>

            <div className="flex justify-between items-center px-5 py-4 border-b sticky top-0 bg-white z-10">
              <div className="flex items-stretch rounded overflow-hidden text-white font-extrabold text-base">
                <span className="bg-[#1a237e] px-2.5 py-1">Belkin</span>
                <span className="bg-[#c62828] px-2.5 py-1">Mart</span>
              </div>
              <XMarkIcon className="w-6 h-6 cursor-pointer text-gray-600" onClick={() => setMobileMenuOpen(false)} />
            </div>

            <div className="px-5 py-3 bg-orange-50 border-b flex items-center justify-between gap-3">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Hello,</p>
                      <Link to="/account" className="text-sm font-bold text-orange-600 truncate block" onClick={() => setMobileMenuOpen(false)}>
                        {userName}
                      </Link>
                    </div>
                  </div>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false) }} className="text-xs text-red-500 font-semibold flex-shrink-0">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-sm font-semibold text-orange-600 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <UserIcon className="w-4 h-4" />
                  Login / Register
                </Link>
              )}
            </div>

            <div className="px-5 py-3 flex gap-5 border-b text-sm font-semibold text-gray-600">
              <Link to="/cart" className="flex items-center gap-1 hover:text-orange-600" onClick={() => setMobileMenuOpen(false)}>
                🛒 Cart
                {cartCount > 0 && <span className="bg-orange-500 text-white text-[10px] px-1.5 rounded-full">{cartCount}</span>}
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center gap-1 hover:text-orange-600"
                onClick={(e) => {
                  setMobileMenuOpen(false)
                  if (!isLoggedIn) {
                    e.preventDefault()
                    sessionStorage.setItem('login_return_to', '/wishlist')
                    navigate('/login')
                  }
                }}
              >
                ❤️ Wishlist
                {wishlistCount > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{wishlistCount}</span>}
              </Link>
              <Link to="/vendor/dashboard" className="hover:text-orange-600" onClick={() => setMobileMenuOpen(false)}>🏪 Seller</Link>
            </div>

            <div className="flex-1 px-5 py-3">
              {navigation.map(cat => (
                <div key={cat.slug} className="mb-1 border-b border-gray-100 pb-1">
                  <button
                    className="w-full flex items-center justify-between py-2.5"
                    onClick={() => setMobileOpenCat(mobileOpenCat === cat.slug ? null : cat.slug)}
                  >
                    <Link
                      to={`/products?category=${cat.slug}`}
                      className="font-bold text-sm text-gray-900 uppercase text-left hover:text-orange-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                    {cat.columns.length > 0 && (
                      <ChevronDownIcon className={`w-4 h-4 flex-shrink-0 transition-transform ${mobileOpenCat === cat.slug ? 'rotate-180 text-orange-500' : 'text-gray-400'}`} />
                    )}
                  </button>
                  {mobileOpenCat === cat.slug && cat.columns.map(col => (
                    <div key={col.slug} className="pl-3 mb-3">
                      <Link
                        to={`/products?category=${col.slug}`}
                        className="text-[11px] font-bold text-orange-500 uppercase mb-1 block"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {col.title}
                      </Link>
                      {col.items.map(item => (
                        <Link
                          key={item.slug}
                          to={`/products?category=${item.slug}`}
                          className="block py-1 text-sm text-gray-600 hover:text-orange-600 transition"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="px-5 py-4 border-t bg-gray-50 text-xs text-gray-400 text-center">
              © 2025 BelkinMart. All rights reserved.
            </div>
          </div>
        </div>
      )}
    </header>
  )
}