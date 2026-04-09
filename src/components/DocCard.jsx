import { FileText, Clock } from 'lucide-react'
import { formatRelativeTime } from '../utils/formatDate'

// Project colors from VISUAL-REFERENCE.md spec
const PROJECT_COLORS = {
  'DWB Ops': { bg: 'rgba(29,158,117,0.15)', text: '#1D9E75' },
  'TWC Ops': { bg: 'rgba(24,95,165,0.15)', text: '#185FA5' },
  Onboarder: { bg: 'rgba(127,119,221,0.15)', text: '#5B52C4' },
  Ministry: { bg: 'rgba(83,74,183,0.15)', text: '#534AB7' },
  Selah: { bg: 'rgba(236,72,153,0.15)', text: '#DB2777' },
  System: { bg: 'rgba(161,161,170,0.15)', text: '#71717a' },
}

function DocCard({ doc, onClick }) {
  const projectStyle = PROJECT_COLORS[doc.project] || { bg: 'rgba(161,161,170,0.15)', text: '#71717a' }

  return (
    <div
      onClick={() => onClick && onClick(doc)}
      className="rounded-xl border border-white/10 bg-zinc-900 p-4 hover:border-[#5DCAA5]/50 hover:bg-zinc-800/50 cursor-pointer transition-all group"
    >
      {/* Project label */}
      {doc.project && (
        <div className="mb-2">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium"
            style={{ backgroundColor: projectStyle.bg, color: projectStyle.text }}
          >
            {doc.project}
          </span>
        </div>
      )}

      {/* Icon + Title */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <FileText className="w-5 h-5 text-[#5DCAA5]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate group-hover:text-[#5DCAA5] transition-colors">
            {doc.title}
          </h3>
        </div>
      </div>

      {/* Description if present */}
      {doc.description && (
        <p className="text-xs text-zinc-500 mt-2 line-clamp-2 leading-relaxed">
          {doc.description}
        </p>
      )}

      {/* Updated time */}
      <div className="flex items-center gap-1 mt-3 text-xs text-zinc-500">
        <Clock size={11} />
        <span>{formatRelativeTime(doc.updatedAt) || doc.updatedAt || 'unknown'}</span>
      </div>
    </div>
  )
}

export default DocCard
