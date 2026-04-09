import { useState } from 'react'
import { ExternalLink, AlertCircle } from 'lucide-react'

function OpenClawView() {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const url = import.meta.env.VITE_OPENCLAW_URL || 'http://72.62.83.62:4000'

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header bar */}
      <div className="flex-shrink-0 h-12 flex items-center justify-between px-4 border-b border-white/10 bg-zinc-900">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">
            OpenClaw
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
          <span className="text-xs text-zinc-500 font-mono truncate max-w-xs">{url}</span>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5DCAA5] hover:bg-[#5DCAA5]/10 rounded-lg transition-colors"
        >
          <ExternalLink size={12} />
          Open in new tab
        </a>
      </div>

      {/* iFrame */}
      <div className="flex-1 relative bg-zinc-950">
        <iframe
          src={url}
          title="OpenClaw"
          className="w-full h-full border-0"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
        {!loaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-[#5DCAA5] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-zinc-500">Loading OpenClaw...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950">
            <AlertCircle size={32} className="text-red-500 mb-3" />
            <p className="text-sm font-medium text-white mb-1">
              Unable to load OpenClaw
            </p>
            <p className="text-xs text-zinc-500">
              Check that the OpenClaw Gateway is running at {url}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OpenClawView
