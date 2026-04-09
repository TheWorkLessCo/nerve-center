import LinkCard from '../components/LinkCard'
import { QUICK_LINKS } from '../lib/constants'

function LinksView() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-white/10 bg-zinc-900">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-white">
            Quick links
          </h2>
          <span className="text-xs text-zinc-500">{QUICK_LINKS.length} links</span>
        </div>
      </div>

      {/* Links grid */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {QUICK_LINKS.map(link => (
            <LinkCard key={link.name} link={link} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LinksView
