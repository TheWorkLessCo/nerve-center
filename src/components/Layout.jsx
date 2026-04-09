import { useState, useEffect } from 'react'
import { AlertTriangle, WifiOff } from 'lucide-react'
import { checkSupabaseHealth } from '../lib/supabase'
import useNetwork from '../hooks/useNetwork'

function Layout({ children }) {
  const [supabaseOk, setSupabaseOk] = useState(true)
  const [envMissing, setEnvMissing] = useState(false)
  const { isOnline } = useNetwork()

  // Check env vars + Supabase health on mount
  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    if (!url || !key) {
      setEnvMissing(true)
      setSupabaseOk(false)
      return
    }
    checkSupabaseHealth().then(ok => setSupabaseOk(ok))
  }, [])

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-950">
      {/* Health banners */}
      {!isOnline && (
        <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-amber-500/10 border-b border-amber-500/30 text-amber-500 text-xs font-medium">
          <WifiOff size={14} />
          Connection lost — working offline. Changes will sync when reconnected.
        </div>
      )}

      {(envMissing || !supabaseOk) && (
        <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-red-500/10 border-b border-red-500/30 text-red-500 text-xs font-medium">
          <AlertTriangle size={14} />
          {envMissing
            ? 'Missing environment variables — check .env setup.'
            : 'Database connection failed — check Supabase credentials.'}
        </div>
      )}

      {/* Main content — full page, no chrome */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}

export default Layout
