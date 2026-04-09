function Skeleton({ className = '', style = {} }) {
  return (
    <div
      className={`animate-pulse rounded bg-zinc-800 ${className}`}
      style={style}
    />
  )
}

export function SkeletonCard({ height = 80 }) {
  return (
    <div className="bg-zinc-900 rounded-xl border border-white/10 p-5">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="w-11 h-11 rounded-lg" />
      </div>
    </div>
  )
}

export function SkeletonActivityRow() {
  return (
    <div className="flex items-center gap-3 py-3 px-4">
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-1.5 min-w-0">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-3 w-full max-w-xs" />
      </div>
      <Skeleton className="h-3 w-16 flex-shrink-0" />
    </div>
  )
}

export function SkeletonActivityFeed({ count = 8 }) {
  return (
    <div className="space-y-0">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonActivityRow key={i} />
      ))}
    </div>
  )
}

export default Skeleton
