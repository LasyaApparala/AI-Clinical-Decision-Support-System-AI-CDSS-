import { useNavigate } from 'react-router-dom'
import React from 'react'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-slate-900/20 opacity-10"></div>
      
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <span className="text-white font-bold text-xl">Glass Health</span>
        </div>
        <button 
          onClick={() => navigate('/auth')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            AI Clinical Decision Support
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-3xl mx-auto">
            Generate differential diagnoses, draft assessments & plans, and answer clinical reference questions with the Glass AI CDS platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={() => navigate('/auth')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors"
            >
              Get Started
            </button>
            <button className="border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors">
              Learn More
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-xl">🔍</span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Differential Diagnosis</h3>
              <p className="text-blue-200">Generate comprehensive differential diagnoses based on patient symptoms and clinical data.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-xl">📝</span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Assessment & Plans</h3>
              <p className="text-blue-200">Draft detailed assessments and treatment plans with AI assistance.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-xl">💡</span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Clinical Reference</h3>
              <p className="text-blue-200">Get instant answers to clinical reference questions with evidence-based responses.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-blue-300">
        <p className="text-sm">
          © 2024 Glass Health. AI Clinical Decision Support platform designed for healthcare professionals.
        </p>
      </footer>
    </div>
  )
}
