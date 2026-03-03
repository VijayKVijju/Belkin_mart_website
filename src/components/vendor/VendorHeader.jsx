import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDownIcon, Bars3Icon, XMarkIcon, PhoneIcon } from '@heroicons/react/24/outline'

export default function VendorHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  const dropdowns = {
    sell: {
      label: 'Sell Online',
      items: [
        { name: 'Create Account', path: '/vendor/register', icon: '📝', desc: 'Start your seller journey' },
        { name: 'List Products', path: '/vendor/products', icon: '📦', desc: 'Add your products easily' },
        { name: 'Receive Payments', path: '/vendor/payments', icon: '💰', desc: 'Get paid securely' },
        { name: 'Manage Business', path: '/vendor/dashboard', icon: '📊', desc: 'Track your growth' },
        { name: 'Help Center', path: '/vendor/help', icon: '🎧', desc: 'Get support anytime' },
      ]
    },
    fees: {
      label: 'Fees & Commission',
      items: [
        { name: 'Payment Types', path: '/vendor/fees', icon: '💳', desc: 'UPI, Cards, Net Banking' },
        { name: 'Fee Structure', path: '/vendor/fees', icon: '📋', desc: 'Transparent pricing' },
        { name: 'Commission Rates', path: '/vendor/fees', icon: '📈', desc: 'Category-wise rates' },
        { name: 'Settlement Cycle', path: '/vendor/fees', icon: '🔄', desc: '7-day settlement cycle' },
      ]
    },
    learn: {
      label: 'Learn',
      items: [
        { name: 'Return Policy', path: '/vendor/learn', icon: '↩️', desc: 'Understand return rules' },
        { name: 'Cash on Delivery', path: '/vendor/learn', icon: '💵', desc: 'COD guidelines' },
        { name: 'Success Stories', path: '/vendor/learn', icon: '⭐', desc: 'Seller journeys' },
        { name: 'FAQ', path: '/vendor/faq', icon: '❓', desc: 'Common questions' },
      ]
    }
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b-2 border-orange-500">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/vendor" className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white font-black text-lg px-3 py-2 rounded-lg shadow">
              BM
            </div>
            <div>
              <span className="text-lg font-black text-gray-900">BelkinMart</span>
              <span className="text-xs font-bold text-orange-500 block leading-none">SELLER PORTAL</span>
            </div>
          </Link>

          {/* Desktop Dropdowns */}
          <nav className="hidden md:flex items-center gap-1">
            {Object.entries(dropdowns).map(([key, dropdown]) => (
              <div key={key} className="relative">
                <button
                  onMouseEnter={() => setActiveDropdown(key)}
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="flex items-center gap-1 px-4 py-2 font-semibold text-gray-700 hover:text-orange-600 transition rounded-lg hover:bg-orange-50 text-sm"
                >
                  {dropdown.label}
                  <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === key ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {activeDropdown === key && (
                  <div
                    onMouseEnter={() => setActiveDropdown(key)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 p-3 min-w-[260px] z-50"
                  >
                    {dropdown.items.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className="flex items-start gap-3 p-3 hover:bg-orange-50 rounded-lg transition group"
                      >
                        <span className="text-xl mt-0.5">{item.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-orange-600 text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+919415761434" className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition">
              <PhoneIcon className="w-4 h-4" />
              <span className="text-sm font-semibold">+91 9415761434</span>
            </a>
            <Link
              to="/vendor/login"
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-orange-500 hover:text-orange-600 transition text-sm"
            >
              Login
            </Link>
            <Link
              to="/vendor/register"
              className="px-5 py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition text-sm shadow-lg"
            >
              Start Selling
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t space-y-1">
            {Object.entries(dropdowns).map(([key, dropdown]) => (
              <div key={key} className="mb-2">
                <p className="px-3 py-2 font-bold text-gray-900 text-xs uppercase tracking-wider text-orange-600">
                  {dropdown.label}
                </p>
                {dropdown.items.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="flex items-center gap-2 px-6 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>{item.icon}</span>
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                ))}
              </div>
            ))}
            <div className="mt-4 pt-4 border-t flex flex-col gap-3 px-3">
              <a href="tel:+919415761434" className="flex items-center gap-2 text-gray-600">
                <PhoneIcon className="w-4 h-4" />
                <span className="text-sm font-semibold">+91 9415761434</span>
              </a>
              <Link to="/vendor/login" className="w-full text-center py-2 border-2 border-gray-300 rounded-lg font-semibold text-gray-700" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
              <Link to="/vendor/register" className="w-full text-center py-2 bg-orange-500 text-white rounded-lg font-bold" onClick={() => setMobileOpen(false)}>
                Start Selling
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
