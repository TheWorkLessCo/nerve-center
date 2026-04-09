import { useState } from 'react'
import { Mail, Lock, ArrowRight, Loader2, UserPlus } from 'lucide-react'

function LoginView({ onLogin, onSignUp }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSignUp, setIsSignUp] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return

    setLoading(true)
    setError(null)

    const action = isSignUp ? onSignUp : onLogin
    const { error: err } = await action(email, password)

    if (err) {
      setError(err.message || 'Authentication failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-full max-w-sm px-4">
        {/* Logo / branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#5DCAA5]/10 border border-[#5DCAA5]/20 mb-4">
            <span className="text-lg font-bold text-[#5DCAA5]">NC</span>
          </div>
          <h1 className="text-xl font-bold text-white mb-1">Nerve Center</h1>
          <p className="text-sm text-zinc-500">
            {isSignUp ? 'Create your account' : 'Sign in to access your dashboard'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-[11px] font-medium text-zinc-500 mb-2 uppercase tracking-wide">
                Email address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-9 pr-4 py-2.5 bg-zinc-800 border border-white/10 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#5DCAA5]/50 transition-colors"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[11px] font-medium text-zinc-500 mb-2 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={isSignUp ? 'Create a password' : 'Enter your password'}
                  required
                  minLength={6}
                  className="w-full pl-9 pr-4 py-2.5 bg-zinc-800 border border-white/10 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#5DCAA5]/50 transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="mb-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-500">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#5DCAA5] text-white rounded-lg hover:bg-[#4DB892] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : isSignUp ? (
                <>
                  Create Account
                  <UserPlus size={15} />
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(null) }}
              className="text-xs text-zinc-500 hover:text-[#5DCAA5] transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-zinc-700 mt-6">
          Secure authentication powered by Supabase
        </p>
      </div>
    </div>
  )
}

export default LoginView
