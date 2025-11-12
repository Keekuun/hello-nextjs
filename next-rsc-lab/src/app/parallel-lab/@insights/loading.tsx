export default function InsightsLoading() {
  return (
    <div className="flex animate-pulse flex-col gap-3">
      <div className="h-4 w-36 rounded bg-violet-200/80" />
      <div className="rounded-lg border border-violet-200 bg-white/70 p-4">
        <div className="mb-3 h-3 w-24 rounded bg-violet-200/70" />
        <div className="mb-2 h-3 w-full rounded bg-violet-100/80" />
        <div className="h-3 w-5/6 rounded bg-violet-100/70" />
      </div>
      <div className="rounded-lg border border-violet-200 bg-white/70 p-4">
        <div className="mb-3 h-3 w-28 rounded bg-violet-200/70" />
        <div className="mb-2 h-3 w-full rounded bg-violet-100/80" />
        <div className="h-3 w-4/5 rounded bg-violet-100/70" />
      </div>
    </div>
  )
}


