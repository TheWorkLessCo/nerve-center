import { ExternalLink, Github, Globe, Database, Workflow, Cloud, Cpu, Mic, Edit, Layers, Monitor } from 'lucide-react'

const ICON_MAP = {
  Github: Github,
  Vercel: Globe,
  Supabase: Database,
  'N8N': Workflow,
  Cloudflare: Cloud,
  OpenClaw: Monitor,
  OpenRouter: Cpu,
  ElevenLabs: Mic,
  GHL: Globe,
  Autenza: Layers,
  default: Globe,
}

function LinkCard({ link, onClick }) {
  const IconComponent = ICON_MAP[link.icon] || ICON_MAP[link.name] || ICON_MAP.default

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className="block rounded-xl border border-white/10 bg-zinc-900 p-5 hover:border-[#5DCAA5]/50 hover:bg-zinc-800/50 transition-all group"
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:bg-[#5DCAA5]/10 transition-colors">
          <IconComponent size={20} className="text-zinc-400 group-hover:text-[#5DCAA5] transition-colors" />
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate group-hover:text-[#5DCAA5] transition-colors">
            {link.name}
          </h3>
          {link.description && (
            <p className="text-xs text-zinc-500 mt-0.5 truncate">
              {link.description}
            </p>
          )}
        </div>

        {/* External link icon */}
        <ExternalLink size={14} className="flex-shrink-0 text-zinc-600 group-hover:text-[#5DCAA5] transition-colors" />
      </div>
    </a>
  )
}

export default LinkCard
