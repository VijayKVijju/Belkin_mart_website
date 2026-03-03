import { Link } from 'react-router-dom'
import VendorHeader from '../components/vendor/VendorHeader'
import VendorFooter from '../components/vendor/VendorFooter'

export default function VendorHelp() {
  const topics = [
    { icon: '🚀', title: 'Getting Started', desc: 'How to create account and list products', path: '/vendor/learn' },
    { icon: '📦', title: 'Product Listings', desc: 'Adding, editing and managing products', path: '/vendor/products' },
    { icon: '💰', title: 'Payments & Fees', desc: 'Understanding commissions and payouts', path: '/vendor/fees' },
    { icon: '🚚', title: 'Shipping & Delivery', desc: 'Order fulfillment and logistics', path: '/vendor/learn' },
    { icon: '↩️', title: 'Returns & Refunds', desc: 'Managing customer returns', path: '/vendor/learn' },
    { icon: '📊', title: 'Dashboard & Reports', desc: 'Using analytics and reports', path: '/vendor/dashboard' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <VendorHeader />
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-black mb-4">Seller Help Center</h1>
            <p className="text-xl text-white/90 mb-8">Everything you need to succeed on BelkinMart</p>
            <div className="max-w-lg mx-auto flex gap-2">
              <input type="text" placeholder="Search for help topics..."
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none" />
              <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
                Search
              </button>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Popular Help Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {topics.map((t, i) => (
                <Link key={i} to={t.path}
                  className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition border border-gray-100 group">
                  <div className="text-4xl mb-3">{t.icon}</div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition mb-2">{t.title}</h3>
                  <p className="text-gray-600 text-sm">{t.desc}</p>
                </Link>
              ))}
            </div>

            <div className="mt-12 bg-orange-50 rounded-2xl p-8 max-w-2xl mx-auto text-center border border-orange-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Still need help?</h3>
              <p className="text-gray-600 mb-4">Contact our dedicated seller support team</p>
              <a href="tel:+919415761434" className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition">
                📞 Call +91 9415761434
              </a>
            </div>
          </div>
        </section>
      </main>
      <VendorFooter />
    </div>
  )
}
