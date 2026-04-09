import { useState } from 'react'
import { Mail, ArrowRight, Loader2 } from 'lucide-react'

function LoginView({ onLogin }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setError(null)

    const { error: err } = await onLogin(email)

    if (err) {
      setError(err.message || 'Failed to send magic link')
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
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
          <p className="text-sm text-zinc-500">Sign in to access your dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
          {sent ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#5DCAA5]/10 mb-4">
                <Mail size={20} className="text-[#5DCAA5]" />
              </div>
              <h2 className="text-base font-semibold text-white mb-2">Check your email</h2>
              <p className="text-sm text-zinc-500 mb-1">
                We sent a magic link to
              </p>
              <p className="text-sm font-medium text-white mb-4">{email}</p>
              <p className="text-xs text-zinc-600">
                Click the link in the email to sign in. It expires in 1 hour.
              </p>
              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="mt-4 text-xs text-[#5DCAA5] hover:underline"
              >
                Use a different email
              </button>
            </div>
          ) : (
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

              {error && (
                <div className="mb-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-xs text-red-500">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#5DCAA5] text-white rounded-lg hover:bg-[#4DB892] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {loading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <>
                    Send Magic Link
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-[11px] text-zinc-700 mt-6">
          Secure authentication powered by Supabase
        </p>
      </div>
    </div>
  )
}

export default LoginView
