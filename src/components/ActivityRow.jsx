import { formatRelativeTime } from '../utils/formatDate'

const STATUS_COLORS = {
  success: 'bg-[#5DCAA5]',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-zinc-500',
}

// Exact agent badge colors from VISUAL-REFERENCE.md / BUILD_SPEC.md
const AGENT_BADGE = {
  Sabbath: { bg: 'rgba(216,90,48,0.15)', text: '#993C1D' },
  Onboarder: { bg: 'rgba(127,119,221,0.15)', text: '#5B52C4' },
  'DWB Ops': { bg: 'rgba(29,158,117,0.15)', text: '#1D9E75' },
  'TWC Ops': { bg: 'rgba(24,95,165,0.15)', text: '#185FA5' },
  Selah: { bg: 'rgba(236,72,153,0.15)', text: '#DB2777' },
}

function ActivityRow({ activity }) {
  const agentName = activity.agent
  const agentStyle = AGENT_BADGE[agentName] || { bg: 'rgba(93,202,165,0.15)', text: '#5DCAA5' }
  const statusColor = STATUS_COLORS[activity.status] || STATUS_COLORS.info

  return (
    <div className="flex items-center py-3 px-4 border-b border-white/5 hover:bg-zinc-800/50 transition-colors">
      {/* Status dot */}
      <div className={`w-2 h-2 rounded-full flex-shrink-0 mr-4 ${statusColor}`} />

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Agent badge */}
          {agentName && (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold"
              style={{ backgroundColor: agentStyle.bg, color: agentStyle.text }}
            >
              {agentName}
            </span>
          )}

          {/* Action text */}
          <p className="text-sm text-zinc-300 truncate">
            {activity.action}
          </p>
        </div>

        {/* Description if present */}
        {activity.description && (
          <p className="text-xs text-zinc-500 mt-0.5 truncate">
            {activity.description}
          </p>
        )}
      </div>

      {/* Timestamp */}
      <div className="ml-4 flex-shrink-0 text-xs text-zinc-500">
        {formatRelativeTime(activity.timestamp)}
      </div>
    </div>
  )
}

export default ActivityRow
