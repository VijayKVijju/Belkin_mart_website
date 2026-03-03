import VendorHeader from '../components/vendor/VendorHeader'
import VendorFooter from '../components/vendor/VendorFooter'

export default function VendorFees() {
  const feeStructure = [
    { category: 'Apparel & Footwear', commission: '8-12%', fixedFee: '₹20', example: 'Shirt ₹500 → Fee ₹60' },
    { category: 'Electronics', commission: '5-8%', fixedFee: '₹30', example: 'Phone ₹15000 → Fee ₹780' },
    { category: 'Home & Decor', commission: '10-15%', fixedFee: '₹20', example: 'Lamp ₹800 → Fee ₹100' },
    { category: 'Food & Grocery', commission: '3-5%', fixedFee: '₹10', example: 'Honey ₹300 → Fee ₹25' },
    { category: 'Beauty & Health', commission: '12-18%', fixedFee: '₹15', example: 'Cream ₹400 → Fee ₹63' },
    { category: 'Toys & Baby', commission: '8-12%', fixedFee: '₹20', example: 'Toy ₹600 → Fee ₹72' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <VendorHeader />
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-black mb-4">Fees & Commission</h1>
            <p className="text-xl text-white/90">Transparent pricing with no hidden charges</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: '✅', title: 'Free to Register', desc: 'No registration or listing fees' },
                { icon: '💰', title: 'Pay on Sale', desc: 'Commission only when you sell' },
                { icon: '🔄', title: '7-Day Settlement', desc: 'Regular payment settlements' },
              ].map((f, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow text-center border border-gray-100">
                  <div className="text-4xl mb-3">{f.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-600 text-sm">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
              <div className="bg-orange-500 text-white p-4">
                <h2 className="text-xl font-bold">Commission Structure by Category</h2>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Category', 'Commission %', 'Fixed Fee', 'Example'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-sm font-bold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {feeStructure.map((f, i) => (
                    <tr key={i} className="hover:bg-orange-50 transition">
                      <td className="px-4 py-3 font-semibold text-gray-900">{f.category}</td>
                      <td className="px-4 py-3 text-orange-600 font-bold">{f.commission}</td>
                      <td className="px-4 py-3 text-gray-700">{f.fixedFee}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{f.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <VendorFooter />
    </div>
  )
}
