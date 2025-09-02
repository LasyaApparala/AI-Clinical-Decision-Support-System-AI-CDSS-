import { useState } from 'react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  // Signup form state
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    reEnterPassword: '',
    specialty: '',
    institution: '',
    degreeType: '',
    clinicianType: '',
    heardFrom: [] as string[],
    terms: false,
    attestation: false
  })

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await login(loginData.email, loginData.password)
      navigate('/chat')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (signupData.password !== signupData.reEnterPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (!signupData.terms || !signupData.attestation) {
      setError('You must agree to the terms and attestation')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          email: signupData.email,
          password: signupData.password,
          specialty: signupData.specialty,
          institution: signupData.institution,
          degreeType: signupData.degreeType,
          clinicianType: signupData.clinicianType,
          heardFrom: signupData.heardFrom
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      // Auto-login after successful signup
      await login(signupData.email, signupData.password)
      navigate('/chat')
    } catch (err: any) {
      setError(err.message || 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleHeardFrom = (source: string) => {
    setSignupData(prev => ({
      ...prev,
      heardFrom: prev.heardFrom.includes(source)
        ? prev.heardFrom.filter(s => s !== source)
        : [...prev.heardFrom, source]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Login' : 'Create a Glass Health account'}
            </h1>
            <p className="text-blue-200">
              {isLogin 
                ? 'Welcome back to Glass Health'
                : 'Generate differential diagnoses, draft assessments & plans, and answer clinical reference questions with the Glass AI CDS platform.'
              }
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <input
                  type="email"
                  placeholder="Email*"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-white/5 border border-white/20 rounded-lg h-12 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  required
                />
              </div>
              
              <div className="relative">
                <input
                  type="password"
                  placeholder="Password*"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full bg-white/5 border border-white/20 rounded-lg h-12 px-4 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !loginData.email || !loginData.password}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>

              <div className="text-center">
                <p className="text-gray-400">
                  New to Glass?{' '}
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name*"
                  value={signupData.firstName}
                  onChange={(e) => setSignupData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="bg-white/5 border border-white/20 rounded-lg h-12 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name*"
                  value={signupData.lastName}
                  onChange={(e) => setSignupData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="bg-white/5 border border-white/20 rounded-lg h-12 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  required
                />
              </div>

              <input
                type="email"
                placeholder="Email*"
                value={signupData.email}
                onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-white/5 border border-white/20 rounded-lg h-12 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Specialty"
                  value={signupData.specialty}
                  onChange={(e) => setSignupData(prev => ({ ...prev, specialty: e.target.value }))}
                  className="bg-white/5 border border-white/20 rounded-lg h-12 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                />
                <input
                  type="text"
                  placeholder="Institution"
                  value={signupData.institution}
                  onChange={(e) => setSignupData(prev => ({ ...prev, institution: e.target.value }))}
                  className="bg-white/5 border border-white/20 rounded-lg h-12 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select
                  value={signupData.degreeType}
                  onChange={(e) => setSignupData(prev => ({ ...prev, degreeType: e.target.value }))}
                  className="bg-white/5 border border-white/20 rounded-lg h-12 px-4 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="">Select Degree Type</option>
                  <option value="md">MD</option>
                  <option value="do">DO</option>
                  <option value="np">NP</option>
                  <option value="pa">PA</option>
                  <option value="other">Other</option>
                </select>
                <select
                  value={signupData.clinicianType}
                  onChange={(e) => setSignupData(prev => ({ ...prev, clinicianType: e.target.value }))}
                  className="bg-white/5 border border-white/20 rounded-lg h-12 px-4 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="">Select Clinician Type</option>
                  <option value="attending">Attending</option>
                  <option value="resident">Resident</option>
                  <option value="fellow">Fellow</option>
                  <option value="student">Student</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="password"
                  placeholder="Password*"
                  value={signupData.password}
                  onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-white/5 border border-white/20 rounded-lg h-12 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  required
                />
                <input
                  type="password"
                  placeholder="Re-enter Password*"
                  value={signupData.reEnterPassword}
                  onChange={(e) => setSignupData(prev => ({ ...prev, reEnterPassword: e.target.value }))}
                  className="bg-white/5 border border-white/20 rounded-lg h-12 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">How did you hear about Glass?</label>
                <div className="flex flex-wrap gap-2">
                  {['podcast', 'twitter', 'instagram', 'youtube', 'friend', 'hospital', 'other'].map((source) => (
                    <button
                      key={source}
                      type="button"
                      onClick={() => toggleHeardFrom(source)}
                      className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                        signupData.heardFrom.includes(source)
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-blue-600 text-blue-600 hover:bg-blue-600/10'
                      }`}
                    >
                      {source.charAt(0).toUpperCase() + source.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={signupData.terms}
                    onChange={(e) => setSignupData(prev => ({ ...prev, terms: e.target.checked }))}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="terms" className="ml-3 text-sm text-gray-300">
                    I agree to the Glass Health{' '}
                    <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a> and{' '}
                    <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>.
                  </label>
                </div>
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="attestation"
                    checked={signupData.attestation}
                    onChange={(e) => setSignupData(prev => ({ ...prev, attestation: e.target.checked }))}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="attestation" className="ml-3 text-sm text-gray-300">
                    I attest that I am a clinician or clinician-in-training, and I understand that Glass is not intended for use by members of the general public for medical diagnosis or other purposes.
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !signupData.firstName || !signupData.lastName || !signupData.email || !signupData.password || !signupData.reEnterPassword || !signupData.terms || !signupData.attestation}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                {isLoading ? 'Creating account...' : 'Create a Glass Health account'}
              </button>

              <div className="text-center">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Login here
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
