import VendorHeader from '../components/vendor/VendorHeader'
import VendorFooter from '../components/vendor/VendorFooter'

export default function VendorLearn() {
  const resources = [
    { icon: '↩️', title: 'Return Policy', content: 'Customers can return products within 7 days of delivery. As a seller, you must accept valid return requests. Our team reviews all disputes fairly. Refunds are processed within 3-5 business days after product is received.' },
    { icon: '💵', title: 'Cash on Delivery (COD)', content: 'COD is available for orders under ₹10,000. COD charges of 1.5% apply to the seller. COD amount is collected by our delivery partner and settled to your account within 7 days. COD orders have higher return rates - plan accordingly.' },
    { icon: '⭐', title: 'Success Stories', content: 'Join thousands of successful sellers on BelkinMart. Sellers who list quality products with good images and descriptions see 3x more sales. Maintain high ratings by providing excellent service and accurate product information.' },
    { icon: '📦', title: 'Packaging Guidelines', content: 'Use sturdy packaging to prevent damage during transit. Label packages clearly with order ID. Use bubble wrap for fragile items. Follow our packaging standards to reduce return rates and get better reviews.' },
  ]

  const faqs = [
    { q: 'How long does it take to start selling?', a: 'After completing registration and verification, you can start listing products within 24-48 hours.' },
    { q: 'What documents do I need?', a: 'You need PAN card, GST certificate (if applicable), bank account details, and business address proof.' },
    { q: 'How do I receive payments?', a: 'Payments are settled directly to your registered bank account within 7 days of order delivery.' },
    { q: 'Can I sell in multiple categories?', a: 'Yes! You can list products across multiple categories from a single seller account.' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <VendorHeader />
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-black mb-4">Seller Learning Center</h1>
            <p className="text-xl text-white/90">Resources to help you succeed on BelkinMart</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {resources.map((r, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow border border-gray-100">
                  <div className="text-4xl mb-3">{r.icon}</div>
                  <h3 className="font-bold text-xl mb-3 text-gray-900">{r.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{r.content}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
              <div className="bg-orange-500 text-white p-4">
                <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
              </div>
              <div className="divide-y">
                {faqs.map((faq, i) => (
                  <div key={i} className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2">Q: {faq.q}</h3>
                    <p className="text-gray-600 text-sm">A: {faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <VendorFooter />
    </div>
  )
}
