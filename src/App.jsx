/*
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { supabase } from './supabaseClient' 

import Header from './components/common/Header'
import Footer from './components/common/Footer'

// Store Pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import About from './pages/About'
import UserProfile from './pages/UserProfile'
import User_Login_phoneno from './pages/User_Login_phoneno'

// Vendor Pages
import VendorLanding from './pages/VendorLanding'
import VendorDashboard from './pages/VendorDashboard'
import VendorLogin from './pages/VendorLogin'
import VendorRegister from './pages/VendorRegister'
import VendorHelp from './pages/VendorHelp'
import VendorFees from './pages/VendorFees'
import VendorLearn from './pages/VendorLearn'

function StoreLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

function App() {
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      const testTable = 'addresses'
      try {
        const { data, error } = await supabase.from(testTable).select('id').limit(1)
        if (error) throw error
        console.log(`%c✅ Connected to Database Table: ${testTable}`, 'color: #3ecf8e; font-weight: bold;')
      } catch (err) {
        console.warn(`%c⚠️ Supabase Note:`, 'color: #f59e0b; font-weight: bold;',
          "Connection works, but table check failed. Ensure RLS policies are set for 'addresses'.")
      }
    }
    checkSupabaseConnection()
  }, [])

  return (
    <Router>
      <Routes>
        {}
        <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
        <Route path="/products" element={<StoreLayout><Products /></StoreLayout>} />
        <Route path="/products/:id" element={<StoreLayout><ProductDetails /></StoreLayout>} />
        <Route path="/cart" element={<StoreLayout><Cart /></StoreLayout>} />
        <Route path="/checkout" element={<StoreLayout><Checkout /></StoreLayout>} />
        <Route path="/about" element={<StoreLayout><About /></StoreLayout>} />

        {}
        <Route path="/login" element={<User_Login_phoneno />} />
        <Route path="/profile" element={<StoreLayout><UserProfile /></StoreLayout>} />
        <Route path="/UserProfile" element={<StoreLayout><UserProfile /></StoreLayout>} />

        {}
        <Route path="/vendor" element={<VendorLanding />} />
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/vendor/register" element={<VendorRegister />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/help" element={<VendorHelp />} />
        <Route path="/vendor/fees" element={<VendorFees />} />
        <Route path="/vendor/learn" element={<VendorLearn />} />
        <Route path="/vendor/faq" element={<VendorLearn />} />
      </Routes>
    </Router>
  )
}

export default App
*/
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { supabase } from './supabaseClient'

import Header from './components/common/Header'
import Footer from './components/common/Footer'

import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import About from './pages/About'
import UserProfile from './pages/UserProfile'
import User_Login_phoneno from './pages/User_Login_phoneno'
import Wishlist from './pages/user_wishlish'

import VendorLanding from './pages/VendorLanding'
import VendorDashboard from './pages/VendorDashboard'
import VendorLogin from './pages/VendorLogin'
import VendorRegister from './pages/VendorRegister'
import VendorHelp from './pages/VendorHelp'
import VendorFees from './pages/VendorFees'
import VendorLearn from './pages/VendorLearn'

function StoreLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

function App() {
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      const testTable = 'addresses'
      try {
        const { data, error } = await supabase.from(testTable).select('id').limit(1)
        if (error) throw error
        console.log(`%c✅ Connected to Database Table: ${testTable}`, 'color: #3ecf8e; font-weight: bold;')
      } catch (err) {
        console.warn(`%c⚠️ Supabase Note:`, 'color: #f59e0b; font-weight: bold;',
          "Connection works, but table check failed. Ensure RLS policies are set for 'addresses'.")
      }
    }
    checkSupabaseConnection()
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
        <Route path="/products" element={<StoreLayout><Products /></StoreLayout>} />
        <Route path="/products/:id" element={<StoreLayout><ProductDetails /></StoreLayout>} />
        <Route path="/cart" element={<StoreLayout><Cart /></StoreLayout>} />
        <Route path="/checkout" element={<StoreLayout><Checkout /></StoreLayout>} />
        <Route path="/about" element={<StoreLayout><About /></StoreLayout>} />
        <Route path="/wishlist" element={<StoreLayout><Wishlist /></StoreLayout>} />

        <Route path="/login" element={<User_Login_phoneno />} />
        <Route path="/profile" element={<StoreLayout><UserProfile /></StoreLayout>} />
        <Route path="/UserProfile" element={<StoreLayout><UserProfile /></StoreLayout>} />
        <Route path="/account" element={<StoreLayout><UserProfile /></StoreLayout>} />

        <Route path="/vendor" element={<VendorLanding />} />
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/vendor/register" element={<VendorRegister />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/help" element={<VendorHelp />} />
        <Route path="/vendor/fees" element={<VendorFees />} />
        <Route path="/vendor/learn" element={<VendorLearn />} />
        <Route path="/vendor/faq" element={<VendorLearn />} />
      </Routes>
    </Router>
  )
}

export default App