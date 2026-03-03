import { Link } from 'react-router-dom'
import VendorHeader from '../components/vendor/VendorHeader'
import VendorFooter from '../components/vendor/VendorFooter'

export default function VendorLanding() {
  const steps = [
    { step: '01', title: 'Create Account', desc: 'Register with your business details in minutes', icon: '📝' },
    { step: '02', title: 'List Products', desc: 'Upload products with images, desc and pricing', icon: '📦' },
    { step: '03', title: 'Start Selling', desc: 'Customers discover and buy your products', icon: '🛒' },
    { step: '04', title: 'Receive Payments', desc: 'Get paid to your bank within 7 days', icon: '💰' },
  ]
  const benefits = [
    { icon: '🌍', title: 'Crores of Customers', desc: 'Access millions of shoppers across India instantly' },
    { icon: '📊', title: 'Powerful Dashboard', desc: 'Manage orders, products and analytics with ease' },
    { icon: '🔒', title: 'Secure Payments', desc: '7-day payment settlement cycle guaranteed' },
    { icon: '🚚', title: 'Logistics Support', desc: 'Pan-India delivery network at your service' },
    { icon: '📱', title: 'Seller Mobile App', desc: 'Manage your business from your smartphone' },
    { icon: '🎧', title: '24/7 Support', desc: 'Dedicated seller support team always available' },
  ]
  const stats = [
    { value: '10L+', label: 'Active Sellers' },
    { value: '5Cr+', label: 'Happy Customers' },
    { value: '500+', label: 'Cities Covered' },
    { value: '₹1000Cr+', label: 'GMV Generated' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <VendorHeader />
      <main className="flex-grow">

        {/* Hero */}
        <section className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-bold mb-6">
                🚀 Join 10 Lakh+ Successful Sellers
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                Grow Your Business<br />With BelkinMart
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Reach crores of customers across India. Start selling online today — it's FREE to join!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/vendor/register" className="bg-white text-orange-600 px-8 py-4 rounded-xl font-black text-lg hover:bg-gray-100 transition shadow-2xl text-center">
                  Start Selling — It's Free! →
                </Link>
                <Link to="/vendor/login" className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition text-center">
                  Existing Seller? Login
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((s, i) => (
                <div key={i}>
                  <p className="text-4xl font-black text-orange-400">{s.value}</p>
                  <p className="text-gray-400 mt-1 text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-black text-center text-gray-900 mb-4">How It Works</h2>
            <p className="text-center text-gray-600 mb-16">Start selling in 4 simple steps</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {steps.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-6xl mb-4">{s.icon}</div>
                  <div className="inline-block bg-orange-100 text-orange-600 font-black text-xs px-3 py-1 rounded-full mb-3">
                    STEP {s.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-black text-center text-gray-900 mb-4">Why Sell on BelkinMart?</h2>
            <p className="text-center text-gray-600 mb-16">Everything you need to grow your business</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((b, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition border border-gray-100">
                  <div className="text-5xl mb-4">{b.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{b.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Ready to Start Selling?</h2>
            <p className="text-xl mb-8 text-white/90">Join thousands of successful sellers. Free to register!</p>
            <Link to="/vendor/register" className="inline-block bg-white text-orange-600 px-10 py-4 rounded-xl font-black text-xl hover:bg-gray-100 transition shadow-2xl">
              Start Selling Now — FREE →
            </Link>
          </div>
        </section>

      </main>
      <VendorFooter />
    </div>
  )
}
