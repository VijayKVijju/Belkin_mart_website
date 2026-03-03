/*
import { useState } from 'react'
import { Link } from 'react-router-dom'
import VendorHeader from '../components/vendor/VendorHeader'
import VendorFooter from '../components/vendor/VendorFooter'

export default function VendorRegister() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    businessName: '', email: '', phone: '',
    password: '', confirmPassword: '', gstNumber: '',
    panNumber: '', category: '', address: '',
    city: '', state: '', pincode: ''
  })

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const totalSteps = 3
  const stepTitles = ['Account Details', 'Business Info', 'Address & KYC']

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <VendorHeader />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 max-w-2xl">

          {}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {stepTitles.map((title, i) => (
                <div key={i} className={`text-sm font-semibold ${i + 1 <= step ? 'text-orange-600' : 'text-gray-400'}`}>
                  {i + 1}. {title}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full transition-all"
                style={{ width: `${(step / totalSteps) * 100}%` }}></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-2xl font-black text-gray-900 mb-2">
              {step === 1 ? 'Create Seller Account' : step === 2 ? 'Business Information' : 'Address & KYC'}
            </h1>
            <p className="text-gray-600 mb-6">Step {step} of {totalSteps}</p>

            {}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name / Business Name *</label>
                  <input type="text" name="businessName" value={formData.businessName} onChange={handleChange}
                    placeholder="Enter business name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange}
                    placeholder="vendor@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Password *</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange}
                    placeholder="Create strong password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password *</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                    placeholder="Re-enter password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
            )}

            {}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">GST Number</label>
                  <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange}
                    placeholder="22AAAAA0000A1Z5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">PAN Number *</label>
                  <input type="text" name="panNumber" value={formData.panNumber} onChange={handleChange}
                    placeholder="ABCDE1234F"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Category *</label>
                  <select name="category" value={formData.category} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="">Select your main category</option>
                    <option>Apparel & Footwear</option>
                    <option>Electronics & Appliances</option>
                    <option>Home & Decor</option>
                    <option>Food & Supplements</option>
                    <option>Toys & Baby Care</option>
                    <option>Fashion & Beauty</option>
                  </select>
                </div>
              </div>
            )}

            {}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Business Address *</label>
                  <textarea name="address" value={formData.address} onChange={handleChange}
                    placeholder="Street address, area, landmark" rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">City *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange}
                      placeholder="Mumbai"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">State *</label>
                    <select name="state" value={formData.state} onChange={handleChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm">
                      <option value="">State</option>
                      <option>Maharashtra</option>
                      <option>Delhi</option>
                      <option>Karnataka</option>
                      <option>Gujarat</option>
                      <option>Uttar Pradesh</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Pincode *</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange}
                      placeholder="400001"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-700">
                      I agree to BelkinMart's <Link to="/vendor/terms" className="text-orange-600 font-semibold">Terms & Conditions</Link> and <Link to="/vendor/privacy" className="text-orange-600 font-semibold">Privacy Policy</Link>
                    </span>
                  </label>
                </div>
              </div>
            )}

            {}
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-orange-500 hover:text-orange-600 transition">
                  ← Back
                </button>
              ) : (
                <Link to="/vendor/login" className="text-gray-600 hover:text-orange-600 flex items-center gap-1 text-sm font-medium">
                  Already a seller? Login
                </Link>
              )}

              {step < totalSteps ? (
                <button onClick={() => setStep(step + 1)}
                  className="px-8 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition shadow">
                  Continue →
                </button>
              ) : (
                <button onClick={() => alert('Registration Successful! Welcome to BelkinMart Seller Portal 🎉')}
                  className="px-8 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition shadow">
                  Complete Registration ✓
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <VendorFooter />
    </div>
  )
}
*/
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import VendorHeader from '../components/vendor/VendorHeader'
import VendorFooter from '../components/vendor/VendorFooter'

// Updated to match your Supabase Enumerated Types exactly
const SELLER_TYPES = [
  { label: 'Wholesaler', value: 'wholesaler' },
  { label: 'Retailer', value: 'retailer' },
  { label: 'Manufacturer', value: 'manufacturer' }
]

const CATEGORIES = [
  { label: 'Multiple Products', value: 'multiple_products' },
  { label: 'Books', value: 'books' }
]

const STATES = ['Maharashtra', 'Delhi', 'Karnataka', 'Gujarat', 'Uttar Pradesh', 'Tamil Nadu', 'Rajasthan', 'West Bengal']

export default function VendorRegister() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Step 1 — Account Details
    businessName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    sellerType: '',

    // Step 2 — Business Info
    gstNumber: '',
    panNumber: '',
    categoryType: '',
    businessDescription: '',
    businessLogo: null,

    // Step 3 — Address & Banking
    street: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    pickupLocationName: '',
    bankAccountNumber: '',
    bankIfsc: '',
  })

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (files) {
      setFormData({ ...formData, [name]: files[0] })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleFinalSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    setLoading(true)

    try {
      // 1. Create User in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.businessName,
            phone: formData.phone,
          },
        },
      })

      if (authError) throw authError
      const user = authData.user

      // 2. Upload Logo (Optional)
      let logoUrl = null
      if (formData.businessLogo) {
        const file = formData.businessLogo
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('vendor-logos')
          .upload(fileName, file)

        if (!uploadError) {
          const { data } = supabase.storage.from('vendor-logos').getPublicUrl(fileName)
          logoUrl = data.publicUrl
        }
      }

      // 3. Insert into 'vendors' table using correct Enum values
      const { error: vendorError } = await supabase.from('vendors').insert([
        {
          user_id: user.id,
          business_name: formData.businessName,
          business_description: formData.businessDescription,
          business_logo: logoUrl,
          gst_number: formData.gstNumber,
          business_address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          bank_account_number: formData.bankAccountNumber,
          bank_ifsc: formData.bankIfsc,
          seller_type: formData.sellerType, // Correct enum value from state
          category_type: formData.categoryType, // Correct enum value from state
          pan_number: formData.panNumber,
          pickup_location_name: formData.pickupLocationName,
          street: formData.street,
          country: formData.country,
          is_approved: false, 
        },
      ])

      if (vendorError) throw vendorError

      alert('Registration Successful! Please check your email for verification.')
      navigate('/vendor/login')
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const totalSteps = 3
  const stepTitles = ['Account Details', 'Business Info', 'Address & Banking']

  const inputCls = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1'

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <VendorHeader />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 max-w-2xl">

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {stepTitles.map((title, i) => (
                <div key={i} className={`text-sm font-semibold ${i + 1 <= step ? 'text-orange-600' : 'text-gray-400'}`}>
                  {i + 1}. {title}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-2xl font-black text-gray-900 mb-2">
              {step === 1 ? 'Create Seller Account' : step === 2 ? 'Business Information' : 'Address & Banking'}
            </h1>
            <p className="text-gray-600 mb-6">Step {step} of {totalSteps}</p>

            {/* Step 1: Account Details */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Full Name / Business Name *</label>
                  <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Enter business name" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="vendor@example.com" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Mobile Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 9876543210" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Seller Type *</label>
                  <select name="sellerType" value={formData.sellerType} onChange={handleChange} className={inputCls}>
                    <option value="">Select seller type</option>
                    {SELLER_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Password *</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create strong password" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Confirm Password *</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter password" className={inputCls} />
                </div>
              </div>
            )}

            {/* Step 2: Business Info */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>GST Number</label>
                  <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="22AAAAA0000A1Z5" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>PAN Number *</label>
                  <input type="text" name="panNumber" value={formData.panNumber} onChange={handleChange} placeholder="ABCDE1234F" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Primary Category *</label>
                  <select name="categoryType" value={formData.categoryType} onChange={handleChange} className={inputCls}>
                    <option value="">Select your main category</option>
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Business Description</label>
                  <textarea name="businessDescription" value={formData.businessDescription} onChange={handleChange} placeholder="Briefly describe your business" rows="3" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Business Logo (Optional)</label>
                  <div className="w-full px-4 py-3 border border-gray-300 border-dashed rounded-lg bg-gray-50">
                    <input type="file" name="businessLogo" accept="image/*" onChange={handleChange} className="w-full text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 cursor-pointer" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Address & Banking */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Pickup Location Name *</label>
                  <input type="text" name="pickupLocationName" value={formData.pickupLocationName} onChange={handleChange} placeholder="e.g. Main Warehouse" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Street / Area *</label>
                  <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Street name" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Full Business Address *</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Building details" rows="2" className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>City *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Mumbai" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>State *</label>
                    <select name="state" value={formData.state} onChange={handleChange} className={inputCls}>
                      <option value="">State</option>
                      {STATES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode *" className={inputCls} />
                  <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country *" className={inputCls} />
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm font-bold text-gray-700 mb-3">Banking Details</p>
                  <input type="text" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} placeholder="Account Number *" className={`${inputCls} mb-3`} />
                  <input type="text" name="bankIfsc" value={formData.bankIfsc} onChange={handleChange} placeholder="IFSC Code *" className={inputCls} />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button onClick={() => setStep(step - 1)} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-orange-500 hover:text-orange-600 transition">
                  ← Back
                </button>
              ) : (
                <Link to="/vendor/login" className="text-gray-600 hover:text-orange-600 flex items-center gap-1 text-sm font-medium">
                  Already a seller? Login
                </Link>
              )}

              {step < totalSteps ? (
                <button onClick={() => setStep(step + 1)} className="px-8 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition shadow">
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handleFinalSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition shadow disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Complete Registration ✓'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <VendorFooter />
    </div>
  )
}