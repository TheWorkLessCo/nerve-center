function MetricCard({ title, value, change, trend, icon: Icon, accentColor = '#5DCAA5' }) {
  const trendIcons = { up: '↑', down: '↓', neutral: '→' }
  const trendColors = {
    up: 'text-[#5DCAA5]',
    down: 'text-red-500',
    neutral: 'text-zinc-500',
  }

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 p-4 hover:border-white/20 transition-colors min-h-[88px] flex items-center">
      <div className="flex items-center justify-between w-full gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            {title}
          </p>
          <p className="text-3xl font-bold text-white mt-1">
            {value}
          </p>
          {change && (
            <p className={`text-xs mt-1 font-medium ${trendColors[trend || 'neutral']}`}>
              {trendIcons[trend || 'neutral']} {change}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            <Icon size={20} style={{ color: accentColor }} />
          </div>
        )}
      </div>
    </div>
  )
}

export default MetricCard
