import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import {
  UserIcon,
  ShoppingBagIcon,
  MapPinIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir',
  'Ladakh','Lakshadweep','Puducherry'
]

const emptyAddress = {
  first_name: '', last_name: '', address_line1: '', address_line2: '',
  landmark: '', pincode: '', city: '', state: '', phone: '', address_type: 'home',
}

export default function UserProfile() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [userData, setUserData] = useState({ full_name: '', email: '', phone: '', date_of_birth: '' })
  const [addressList, setAddressList] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  // Address modal state
  const [showModal, setShowModal] = useState(false)
  const [addrForm, setAddrForm] = useState(emptyAddress)
  const [addrSaving, setAddrSaving] = useState(false)
  const [addrError, setAddrError] = useState('')

  useEffect(() => { fetchProfileData() }, [])

  const fetchProfileData = async () => {
    const userId = localStorage.getItem('temp_user_id')
    if (!userId) { navigate('/login'); return }

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (profile) setUserData({ full_name: profile.full_name || '', email: profile.email || '', phone: profile.phone || '', date_of_birth: profile.date_of_birth || '' })

    const { data: adds } = await supabase.from('addresses').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    if (adds) setAddressList(adds)

    const { data: ords } = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    if (ords) setOrders(ords)

    setLoading(false)
  }

  const saveProfile = async () => {
    const userId = localStorage.getItem('temp_user_id')
    if (!userId) return
    setSaving(true); setSaveMsg('')
    const { error } = await supabase.from('profiles').update({
      full_name: userData.full_name,
      email: userData.email,
      date_of_birth: userData.date_of_birth || null,
      updated_at: new Date().toISOString(),
    }).eq('id', userId)
    setSaving(false)
    if (error) setSaveMsg('❌ ' + error.message)
    else { setSaveMsg('✅ Saved!'); setTimeout(() => setSaveMsg(''), 3000) }
  }

  const saveAddress = async () => {
    const userId = localStorage.getItem('temp_user_id')
    if (!userId) return

    // Validation
    const required = ['first_name','last_name','address_line1','address_line2','pincode','city','state','phone']
    for (const f of required) {
      if (!addrForm[f]?.trim()) { setAddrError(`Please fill in all required fields.`); return }
    }
    if (addrForm.phone.length !== 10) { setAddrError('Enter a valid 10-digit mobile number.'); return }
    if (addrForm.pincode.length !== 6) { setAddrError('Enter a valid 6-digit pincode.'); return }

    setAddrSaving(true); setAddrError('')

    const fullName = `${addrForm.first_name.trim()} ${addrForm.last_name.trim()}`
    const payload = {
      user_id: userId,
      full_name: fullName,
      address_line1: addrForm.address_line1.trim(),
      address_line2: `${addrForm.address_line2.trim()}${addrForm.landmark.trim() ? ', ' + addrForm.landmark.trim() : ''}`,
      city: addrForm.city.trim(),
      state: addrForm.state,
      pincode: addrForm.pincode.trim(),
      phone: `+91${addrForm.phone.trim()}`,
      address_type: addrForm.address_type,
      is_default: addressList.length === 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('addresses').insert(payload)
    setAddrSaving(false)
    if (error) { setAddrError('Failed to save: ' + error.message); return }

    setShowModal(false)
    setAddrForm(emptyAddress)
    fetchProfileData()
  }

  const deleteAddress = async (id) => {
    if (!confirm('Delete this address?')) return
    await supabase.from('addresses').delete().eq('id', id)
    setAddressList(prev => prev.filter(a => a.id !== id))
  }

  const handleLogout = () => {
    localStorage.removeItem('temp_user_id')
    localStorage.removeItem('temp_user_phone')
    navigate('/login')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  )

  const navItems = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'orders', label: 'My Orders', icon: ShoppingBagIcon },
    { id: 'addresses', label: 'Addresses', icon: MapPinIcon },
  ]

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{userData.full_name || 'User'}</p>
                  <p className="text-xs text-gray-400">{userData.phone}</p>
                </div>
              </div>
              <nav className="p-3 space-y-1">
                {navItems.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === id ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <Icon className="w-5 h-5" />{label}
                  </button>
                ))}
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all mt-2">
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main */}
          <div className="lg:col-span-3">

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" value={userData.full_name}
                      onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="text" value={userData.phone} readOnly
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed outline-none" />
                    <p className="text-xs text-gray-400 mt-1">Phone cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input type="date" value={userData.date_of_birth}
                      onChange={(e) => setUserData({ ...userData, date_of_birth: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition" />
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <button onClick={saveProfile} disabled={saving}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition shadow-md disabled:opacity-60 flex items-center gap-2">
                    {saving ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Saving...</> : 'Save Changes'}
                  </button>
                  {saveMsg && <span className={`text-sm font-medium ${saveMsg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>{saveMsg}</span>}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingBagIcon className="w-14 h-14 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border border-gray-100 rounded-xl p-4 flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-700">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-500">₹{order.total_amount}</p>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{order.status || 'Placed'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Saved Addresses</h2>
                  <button onClick={() => { setAddrForm(emptyAddress); setAddrError(''); setShowModal(true) }}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">
                    <PlusIcon className="w-4 h-4" /> Add New
                  </button>
                </div>
                {addressList.length === 0 ? (
                  <div className="text-center py-16">
                    <MapPinIcon className="w-14 h-14 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No addresses saved</p>
                    <p className="text-gray-300 text-sm mt-1">Click "Add New" to add your first address</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {addressList.map(addr => (
                      <div key={addr.id} className="border border-gray-100 rounded-xl p-4 relative">
                        {addr.is_default && (
                          <span className="absolute top-3 right-10 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">Default</span>
                        )}
                        <button onClick={() => deleteAddress(addr.id)}
                          className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition">
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                        <p className="font-semibold text-gray-700">{addr.full_name}</p>
                        <p className="text-sm text-gray-500 mt-1">{addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}</p>
                        <p className="text-sm text-gray-500">{addr.city}, {addr.state} — {addr.pincode}</p>
                        <p className="text-sm text-gray-400 mt-1">📞 {addr.phone}</p>
                        {addr.address_type && (
                          <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full capitalize">{addr.address_type}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Add New Address</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {addrError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{addrError}</div>
              )}

              {/* First + Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input type="text" placeholder="Enter First Name*" value={addrForm.first_name}
                    onChange={e => setAddrForm({ ...addrForm, first_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none text-sm" />
                </div>
                <div>
                  <input type="text" placeholder="Enter Last Name*" value={addrForm.last_name}
                    onChange={e => setAddrForm({ ...addrForm, last_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none text-sm" />
                </div>
              </div>

              {/* House / Building */}
              <input type="text" placeholder="House No, Building Name*" value={addrForm.address_line1}
                onChange={e => setAddrForm({ ...addrForm, address_line1: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none text-sm" />

              {/* Street */}
              <input type="text" placeholder="Street Name, Area*" value={addrForm.address_line2}
                onChange={e => setAddrForm({ ...addrForm, address_line2: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none text-sm" />

              {/* Landmark */}
              <input type="text" placeholder="Landmark (optional)" value={addrForm.landmark}
                onChange={e => setAddrForm({ ...addrForm, landmark: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none text-sm" />

              {/* Pincode + City */}
              <div className="grid grid-cols-2 gap-3">
                <input type="text" inputMode="numeric" placeholder="Postal Code*" value={addrForm.pincode}
                  onChange={e => setAddrForm({ ...addrForm, pincode: e.target.value.replace(/\D/g,'').slice(0,6) })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none text-sm" />
                <input type="text" placeholder="City / District*" value={addrForm.city}
                  onChange={e => setAddrForm({ ...addrForm, city: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none text-sm" />
              </div>

              {/* Country + State */}
              <div className="grid grid-cols-2 gap-3">
                <div className="px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-500 flex items-center justify-between">
                  India <span>▾</span>
                </div>
                <select value={addrForm.state} onChange={e => setAddrForm({ ...addrForm, state: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none text-sm bg-white">
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Mobile */}
              <div className="flex gap-0 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-cyan-400">
                <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-500 border-r border-gray-200">+91</div>
                <input type="tel" inputMode="numeric" placeholder="Mobile Number*" value={addrForm.phone}
                  onChange={e => setAddrForm({ ...addrForm, phone: e.target.value.replace(/\D/g,'').slice(0,10) })}
                  className="flex-1 px-4 py-3 outline-none text-sm" />
              </div>

              {/* Address Type */}
              <div className="flex gap-3">
                {['home','work','other'].map(type => (
                  <button key={type} onClick={() => setAddrForm({ ...addrForm, address_type: type })}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition capitalize ${addrForm.address_type === type ? 'bg-cyan-500 text-white border-cyan-500' : 'border-gray-200 text-gray-500 hover:border-cyan-300'}`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 pt-0">
              <button onClick={saveAddress} disabled={addrSaving}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 rounded-xl transition disabled:opacity-60 flex items-center justify-center gap-2">
                {addrSaving ? <><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Saving...</> : 'Save Address'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}