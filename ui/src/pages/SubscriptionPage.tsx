import { useState } from 'react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleUpgrade = async (plan: 'monthly' | 'annual') => {
    setIsLoading(true)
    try {
      // Here you would integrate with your payment processor (Stripe, etc.)
      const response = await fetch('/api/subscription/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          plan: plan
        })
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url // Redirect to Stripe checkout
      } else {
        throw new Error('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate('/chat')}
            className="text-gray-500 hover:text-gray-700 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Chat
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Upgrade to Glass Pro</h1>
          <p className="text-lg text-gray-600 mt-4">Unlock unlimited access to powerful clinical AI with our Pro plan.</p>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <div className={`bg-white p-8 rounded-xl border-2 transition-all ${
            selectedPlan === 'monthly' ? 'border-blue-600 shadow-lg' : 'border-gray-200'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Pro (Monthly)</h2>
              <div className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-full">20 USD / month</div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">What's Included</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Generate unlimited AI queries
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Deep Reasoning Mode (increased accuracy)
                </li>
              </ul>
            </div>
            <button 
              onClick={() => handleUpgrade('monthly')}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Get Pro'}
            </button>
          </div>

          {/* Annual Plan */}
          <div className={`bg-white p-8 rounded-xl border-2 transition-all ${
            selectedPlan === 'annual' ? 'border-blue-600 shadow-lg' : 'border-gray-200'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Pro (Annual)</h2>
              <div className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-full">18 USD / month</div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">What's Included</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Generate unlimited AI queries
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Deep Reasoning Mode (increased accuracy)
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-600 font-medium">Save 10% annually</span>
                </li>
              </ul>
            </div>
            <button 
              onClick={() => handleUpgrade('annual')}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Get Pro'}
            </button>
          </div>
        </div>

        {/* Performance Benchmarks */}
        <div className="bg-white p-8 rounded-xl border border-gray-200 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Clinical Performance Benchmarks</h2>
          
          <div className="flex items-end space-x-4 md:space-x-8 h-80">
            {/* USMLE */}
            <div className="flex-1 h-full flex flex-col justify-end items-center">
              <div className="flex items-end w-full space-x-2">
                <div className="w-1/2 flex flex-col items-center">
                  <div className="text-gray-800 font-medium">89%</div>
                  <div className="bg-blue-200 w-full rounded-t-md" style={{ height: '253px' }}></div>
                </div>
                <div className="w-1/2 flex flex-col items-center">
                  <div className="text-gray-800 font-medium">97%</div>
                  <div className="bg-blue-600 w-full rounded-t-md" style={{ height: '276px' }}></div>
                </div>
              </div>
              <div className="text-center text-gray-600 pt-2 border-t-2 border-gray-200 w-full mt-2">USMLE</div>
            </div>

            {/* JAMA CC */}
            <div className="flex-1 h-full flex flex-col justify-end items-center">
              <div className="flex items-end w-full space-x-2">
                <div className="w-1/2 flex flex-col items-center">
                  <div className="text-gray-800 font-medium">91%</div>
                  <div className="bg-blue-200 w-full rounded-t-md" style={{ height: '259px' }}></div>
                </div>
                <div className="w-1/2 flex flex-col items-center">
                  <div className="text-gray-800 font-medium">98%</div>
                  <div className="bg-blue-600 w-full rounded-t-md" style={{ height: '279px' }}></div>
                </div>
              </div>
              <div className="text-center text-gray-600 pt-2 border-t-2 border-gray-200 w-full mt-2">JAMA CC</div>
            </div>

            {/* NEJM CPC */}
            <div className="flex-1 h-full flex flex-col justify-end items-center">
              <div className="flex items-end w-full space-x-2">
                <div className="w-1/2 flex flex-col items-center">
                  <div className="text-gray-800 font-medium">78%</div>
                  <div className="bg-blue-200 w-full rounded-t-md" style={{ height: '222px' }}></div>
                </div>
                <div className="w-1/2 flex flex-col items-center">
                  <div className="text-gray-800 font-medium">90%</div>
                  <div className="bg-blue-600 w-full rounded-t-md" style={{ height: '256px' }}></div>
                </div>
              </div>
              <div className="text-center text-gray-600 pt-2 border-t-2 border-gray-200 w-full mt-2">NEJM CPC</div>
            </div>
          </div>

          {/* Y-axis labels */}
          <div className="relative mt-[-320px] h-80">
            <div className="absolute left-[-40px] top-0 h-full flex flex-col justify-between text-right text-gray-500 text-sm">
              <span>100</span>
              <span>80</span>
              <span>60</span>
              <span>40</span>
              <span>20</span>
              <span>0</span>
            </div>
            <div className="absolute top-0 left-[-50px] transform -rotate-90 origin-center translate-y-1/2 -translate-x-1/2 text-gray-600 font-medium" style={{ marginLeft: '-25px', marginTop: '-15px' }}>
              Accuracy (%)
            </div>
            <div className="h-full ml-4">
              <div className="h-1/5 border-b border-gray-200 border-dashed"></div>
              <div className="h-1/5 border-b border-gray-200 border-dashed"></div>
              <div className="h-1/5 border-b border-gray-200 border-dashed"></div>
              <div className="h-1/5 border-b border-gray-200 border-dashed"></div>
              <div className="h-1/5"></div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center space-x-8 mt-8">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-200 rounded mr-2"></div>
              <span className="text-gray-600">Standard Mode</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
              <span className="text-gray-600">Deep Reasoning Mode</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
