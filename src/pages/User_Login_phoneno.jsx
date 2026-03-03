
//------------------------------------------------------otp working fine------------------------------------------------------
/*
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function User_Login_phoneno() {
  const navigate = useNavigate()
  const [step, setStep] = useState('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    let interval
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000)
    } else if (timer === 0) {
      setCanResend(true)
    }
    return () => clearInterval(interval)
  }, [step, timer])

  // ✅ Send OTP via Supabase Edge Function → Twilio Verify
  const sendOTP = async () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }
    setError('')
    setLoading(true)

    try {
      const { data, error: fnError } = await supabase.functions.invoke('send-otp', {
        body: { phone: `+91${phone}` }
      })

      if (fnError) throw fnError
      if (data?.status !== 'pending') throw new Error(data?.message || 'Failed to send OTP')

      setStep('otp')
      setTimer(30)
      setCanResend(false)
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Verify OTP via Supabase Edge Function → Twilio Verify
  const verifyOTP = async () => {
    const otpCode = otp.join('')
    if (otpCode.length !== 6) {
      setError('Please enter the full 6-digit code.')
      return
    }

    setError('')
    setLoading(true)

    try {
      // 1. Verify OTP via Twilio through Edge Function
      const { data, error: fnError } = await supabase.functions.invoke('verify-otp', {
        body: { phone: `+91${phone}`, code: otpCode }
      })

      if (fnError) throw fnError
      if (!data?.verified) throw new Error('Invalid OTP. Please try again.')

      // 2. Sign in anonymously to create a Supabase session
      const { data: authData, error: authError } = await supabase.auth.signInAnonymously()
      if (authError) throw authError

      // 3. Upsert profile with phone number
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          phone: `+91${phone}`,
          user_type: 'customer',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' })

      if (profileError) throw new Error('Failed to save profile: ' + profileError.message)

      // 4. Redirect to profile
      navigate('/UserProfile')

    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handleReset = () => {
    setStep('phone')
    setOtp(['', '', '', '', '', ''])
    setError('')
    setTimer(30)
    setCanResend(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">

        {}
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white font-black text-xl w-12 h-12 rounded-xl flex items-center justify-center">
            BM
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-2">Welcome!</h2>
        <p className="text-center text-gray-600 mb-8">Login to BelkinMart</p>

        {}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {}
        {step === 'phone' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="bg-gray-100 px-3 py-4 rounded-xl border border-gray-200 font-semibold text-gray-500">
                +91
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setError('')
                  setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                }}
                placeholder="Mobile number"
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                autoFocus
              />
            </div>
            <button
              onClick={sendOTP}
              disabled={loading || phone.length !== 10}
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition disabled:opacity-50 shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Sending...
                </>
              ) : 'Send OTP'}
            </button>
          </div>
        )}

        {}
        {step === 'otp' && (
          <div className="space-y-6">
            <p className="text-center text-sm text-gray-500">
              OTP sent to <span className="font-semibold text-gray-700">+91 {phone}</span>
            </p>

            {}
            <div className="flex gap-2 justify-center">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  maxLength={1}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                />
              ))}
            </div>

            {}
            <button
              onClick={verifyOTP}
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Verifying...
                </>
              ) : 'Verify & Continue'}
            </button>

            {}
            <div className="text-center">
              {canResend ? (
                <button
                  onClick={sendOTP}
                  disabled={loading}
                  className="text-orange-600 font-semibold text-sm hover:underline"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-gray-400 text-sm">Resend in {timer}s</p>
              )}
            </div>

            {}
            <button
              onClick={handleReset}
              className="w-full text-gray-400 text-sm hover:text-gray-600"
            >
              ← Change number
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

*/
/*
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function User_Login_phoneno() {
  const navigate = useNavigate()
  const [step, setStep] = useState('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    let interval
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000)
    } else if (timer === 0) {
      setCanResend(true)
    }
    return () => clearInterval(interval)
  }, [step, timer])

  // ✅ Send OTP via Supabase Edge Function → Twilio Verify
  const sendOTP = async () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }
    setError('')
    setLoading(true)

    try {
      const { data, error: fnError } = await supabase.functions.invoke('send-otp', {
        body: { phone: `+91${phone}` }
      })

      if (fnError) throw fnError
      if (data?.status !== 'pending') throw new Error(data?.message || 'Failed to send OTP')

      setStep('otp')
      setTimer(30)
      setCanResend(false)
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Verify OTP via Edge Function → then upsert profile with phone as unique key
  const verifyOTP = async () => {
    const otpCode = otp.join('')
    if (otpCode.length !== 6) {
      setError('Please enter the full 6-digit code.')
      return
    }

    setError('')
    setLoading(true)

    try {
      // 1. Verify OTP via Twilio through Edge Function
      const { data, error: fnError } = await supabase.functions.invoke('verify-otp', {
        body: { phone: `+91${phone}`, code: otpCode }
      })

      if (fnError) throw fnError
      if (!data?.verified) throw new Error('Invalid OTP. Please try again.')

      const fullPhone = `+91${phone}`

      // 2. Check if user already exists by phone
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', fullPhone)
        .single()

      let userId

      if (existingProfile) {
        // Returning user — use existing ID
        userId = existingProfile.id
      } else {
        // New user — generate a UUID and create profile
        const newId = crypto.randomUUID()
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: newId,
            phone: fullPhone,
            user_type: 'customer',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

        if (insertError) throw new Error('Failed to create profile: ' + insertError.message)
        userId = newId
      }

      // 3. Store user session in localStorage
      localStorage.setItem('temp_user_id', userId)
      localStorage.setItem('temp_user_phone', fullPhone)

      // 4. Redirect to profile
      navigate('/UserProfile')

    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handleReset = () => {
    setStep('phone')
    setOtp(['', '', '', '', '', ''])
    setError('')
    setTimer(30)
    setCanResend(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">

        {}
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white font-black text-xl w-12 h-12 rounded-xl flex items-center justify-center">
            BM
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-2">Welcome!</h2>
        <p className="text-center text-gray-600 mb-8">Login to BelkinMart</p>

        {}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {}
        {step === 'phone' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="bg-gray-100 px-3 py-4 rounded-xl border border-gray-200 font-semibold text-gray-500">
                +91
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setError('')
                  setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                }}
                placeholder="Mobile number"
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                autoFocus
              />
            </div>
            <button
              onClick={sendOTP}
              disabled={loading || phone.length !== 10}
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition disabled:opacity-50 shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Sending...
                </>
              ) : 'Send OTP'}
            </button>
          </div>
        )}

        {}
        {step === 'otp' && (
          <div className="space-y-6">
            <p className="text-center text-sm text-gray-500">
              OTP sent to <span className="font-semibold text-gray-700">+91 {phone}</span>
            </p>

            {}
            <div className="flex gap-2 justify-center">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  maxLength={1}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                />
              ))}
            </div>

            {}
            <button
              onClick={verifyOTP}
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Verifying...
                </>
              ) : 'Verify & Continue'}
            </button>

            {}
            <div className="text-center">
              {canResend ? (
                <button
                  onClick={sendOTP}
                  disabled={loading}
                  className="text-orange-600 font-semibold text-sm hover:underline"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-gray-400 text-sm">Resend in {timer}s</p>
              )}
            </div>

            {}
            <button
              onClick={handleReset}
              className="w-full text-gray-400 text-sm hover:text-gray-600"
            >
              ← Change number
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
  */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const SESSION_DURATION_MS = 4 * 60 * 60 * 1000

export default function User_Login_phoneno() {
  const navigate = useNavigate()
  const [step, setStep] = useState('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    const userId = localStorage.getItem('temp_user_id')
    const loginTime = parseInt(localStorage.getItem('temp_user_login_time') || '0', 10)
    const sessionValid = userId && loginTime && (Date.now() - loginTime < SESSION_DURATION_MS)
    if (sessionValid) {
      navigate('/', { replace: true })
    } else if (userId) {
      localStorage.removeItem('temp_user_id')
      localStorage.removeItem('temp_user_phone')
      localStorage.removeItem('temp_user_name')
      localStorage.removeItem('temp_user_login_time')
    }
  }, [navigate])

  useEffect(() => {
    let interval
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000)
    } else if (timer === 0) {
      setCanResend(true)
    }
    return () => clearInterval(interval)
  }, [step, timer])

  const sendOTP = async () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }
    setError('')
    setLoading(true)

    try {
      const { data, error: fnError } = await supabase.functions.invoke('send-otp', {
        body: { phone: `+91${phone}` }
      })

      if (fnError) throw fnError
      if (data?.status !== 'pending') throw new Error(data?.message || 'Failed to send OTP')

      setStep('otp')
      setTimer(30)
      setCanResend(false)
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async () => {
    const otpCode = otp.join('')
    if (otpCode.length !== 6) {
      setError('Please enter the full 6-digit code.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const { data, error: fnError } = await supabase.functions.invoke('verify-otp', {
        body: { phone: `+91${phone}`, code: otpCode }
      })

      if (fnError) throw fnError
      if (!data?.verified) throw new Error('Invalid OTP. Please try again.')

      const fullPhone = `+91${phone}`

      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('phone', fullPhone)
        .single()

      let userId
      let userName = ''

      if (existingProfile) {
        userId = existingProfile.id
        userName = existingProfile.full_name || ''
      } else {
        const newId = crypto.randomUUID()
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: newId,
            phone: fullPhone,
            user_type: 'customer',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

        if (insertError) throw new Error('Failed to create profile: ' + insertError.message)
        userId = newId
      }

      localStorage.setItem('temp_user_id', userId)
      localStorage.setItem('temp_user_phone', fullPhone)
      localStorage.setItem('temp_user_name', userName || `User ${phone.slice(-4)}`)
      localStorage.setItem('temp_user_login_time', Date.now().toString())

      window.dispatchEvent(new Event('userLoggedIn'))

      const returnTo = sessionStorage.getItem('login_return_to') || '/'
      sessionStorage.removeItem('login_return_to')
      navigate(returnTo, { replace: true })

    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handleReset = () => {
    setStep('phone')
    setOtp(['', '', '', '', '', ''])
    setError('')
    setTimer(30)
    setCanResend(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">

        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white font-black text-xl w-12 h-12 rounded-xl flex items-center justify-center">
            BM
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-2">Welcome!</h2>
        <p className="text-center text-gray-600 mb-8">Login to BelkinMart</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {step === 'phone' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="bg-gray-100 px-3 py-4 rounded-xl border border-gray-200 font-semibold text-gray-500">
                +91
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setError('')
                  setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                }}
                placeholder="Mobile number"
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                autoFocus
              />
            </div>
            <button
              onClick={sendOTP}
              disabled={loading || phone.length !== 10}
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition disabled:opacity-50 shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Sending...
                </>
              ) : 'Send OTP'}
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-6">
            <p className="text-center text-sm text-gray-500">
              OTP sent to <span className="font-semibold text-gray-700">+91 {phone}</span>
            </p>

            <div className="flex gap-2 justify-center">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  maxLength={1}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                />
              ))}
            </div>

            <button
              onClick={verifyOTP}
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Verifying...
                </>
              ) : 'Verify & Continue'}
            </button>

            <div className="text-center">
              {canResend ? (
                <button
                  onClick={sendOTP}
                  disabled={loading}
                  className="text-orange-600 font-semibold text-sm hover:underline"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-gray-400 text-sm">Resend in {timer}s</p>
              )}
            </div>

            <button
              onClick={handleReset}
              className="w-full text-gray-400 text-sm hover:text-gray-600"
            >
              ← Change number
            </button>
          </div>
        )}
      </div>
    </div>
  )
}