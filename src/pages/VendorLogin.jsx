import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import VendorHeader from '../components/vendor/VendorHeader'
import VendorFooter from '../components/vendor/VendorFooter'

// Initialize Supabase client
// Replace with your actual Supabase URL and anon key
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function VendorLogin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setError('') // Clear error on input change
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (data?.user) {
        // Optional: Check if user has vendor role in your DB
        // const { data: vendorData, error: vendorError } = await supabase
        //   .from('vendors')
        //   .select('*')
        //   .eq('user_id', data.user.id)
        //   .single()
        // if (vendorError || !vendorData) {
        //   setError('No vendor account found. Please register first.')
        //   await supabase.auth.signOut()
        //   return
        // }

        navigate('/vendor/dashboard')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <VendorHeader />
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white font-black text-2xl w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">BM</div>
              <h1 className="text-2xl font-black text-gray-900">Seller Login</h1>
              <p className="text-gray-600 mt-1">Access your BelkinMart seller account</p>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div className="flex justify-end">
                <Link to="/vendor/forgot-password" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                  Forgot Password?
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-orange-500 text-white rounded-lg font-bold text-lg hover:bg-orange-600 transition shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Logging in...
                  </>
                ) : (
                  'Login to Seller Account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">New to BelkinMart Seller?</p>
              <Link to="/vendor/register" className="text-orange-600 font-bold hover:text-orange-700 text-lg">
                Start Selling — It's Free! →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <VendorFooter />
    </div>
  )
}