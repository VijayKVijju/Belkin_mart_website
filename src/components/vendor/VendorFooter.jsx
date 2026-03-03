import { Link } from 'react-router-dom'

export default function VendorFooter() {
  const year = new Date().getFullYear()

  const columns = [
    {
      title: 'Sell Online',
      links: [
        { name: 'Create Account', path: '/vendor/register' },
        { name: 'List Products', path: '/vendor/products' },
        { name: 'Receive Payments', path: '/vendor/payments' },
        { name: 'Manage Business', path: '/vendor/dashboard' },
        { name: 'Help Center', path: '/vendor/help' },
      ]
    },
    {
      title: 'Fees & Commission',
      links: [
        { name: 'Payment Types', path: '/vendor/fees' },
        { name: 'Fee Structure', path: '/vendor/fees' },
        { name: 'Commission Rates', path: '/vendor/fees' },
        { name: 'Settlement Cycle', path: '/vendor/fees' },
      ]
    },
    {
      title: 'Learn',
      links: [
        { name: 'Return Policy', path: '/vendor/learn' },
        { name: 'Cash on Delivery (COD)', path: '/vendor/learn' },
        { name: 'Success Stories', path: '/vendor/learn' },
        { name: 'FAQ', path: '/vendor/faq' },
        { name: 'Video Tutorials', path: '/vendor/learn' },
      ]
    }
  ]

  const socials = [
    { name: 'Facebook', icon: '📘', url: '#' },
    { name: 'Twitter', icon: '🐦', url: '#' },
    { name: 'Instagram', icon: '📸', url: '#' },
    { name: 'LinkedIn', icon: '💼', url: '#' },
    { name: 'YouTube', icon: '▶️', url: '#' },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Back to Top */}
      <div className="bg-gray-800 py-3 text-center border-b border-gray-700">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-orange-400 font-semibold hover:text-orange-300 transition text-sm flex items-center gap-1 mx-auto"
        >
          ↑ Back to top
        </button>
      </div>

      {/* Main Footer Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Link Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-white font-bold text-base mb-4 pb-2 border-b border-gray-700">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-400 hover:text-orange-400 transition hover:pl-1 duration-200 block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Registered Office */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 pb-2 border-b border-gray-700">
              Registered Office
            </h3>
            <div className="text-sm space-y-1 text-gray-400">
              <p className="font-bold text-white text-base">BelkinMart Pvt. Ltd.</p>
              <p>123, Business Park, Civil Lines,</p>
              <p>New Delhi - 110001</p>
              <p>Uttar Pradesh, India</p>
              <div className="mt-3 space-y-1 pt-2 border-t border-gray-700">
                <p><span className="text-gray-500">CIN: </span>U74999DL2024PTC123456</p>
                <p><span className="text-gray-500">GSTIN: </span>07AABCU9603R1ZP</p>
                <p><span className="text-gray-500">Tel: </span>+91 9415761434</p>
              </div>
            </div>

            {/* App Download Links */}
            <div className="mt-5 space-y-2">
              <p className="text-white font-semibold text-sm">Download Seller App</p>
              <a href="#" className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition">
                <span className="text-2xl">🍎</span>
                <div>
                  <p className="text-xs text-gray-400">Download on the</p>
                  <p className="text-sm font-bold text-white">App Store</p>
                </div>
              </a>
              <a href="#" className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition">
                <span className="text-2xl">🤖</span>
                <div>
                  <p className="text-xs text-gray-400">Get it on</p>
                  <p className="text-sm font-bold text-white">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <Link to="/vendor" className="flex items-center gap-2">
            <div className="bg-orange-500 text-white font-black px-2 py-1 rounded text-sm">BM</div>
            <span className="font-bold text-white">BelkinMart</span>
            <span className="text-orange-400 text-xs font-bold border border-orange-400 px-1 rounded">SELLER</span>
          </Link>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Follow us:</span>
            {socials.map((s) => (
              <a key={s.name} href={s.url} title={s.name}
                className="text-xl hover:scale-125 transition-transform cursor-pointer">
                {s.icon}
              </a>
            ))}
          </div>

          <p className="text-sm text-gray-500">
            © {year} BelkinMart Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
