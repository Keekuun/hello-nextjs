export default function ActivityLoading() {
  return (
    <div className="flex animate-pulse flex-col gap-3">
      <div className="h-4 w-32 rounded bg-emerald-200/80" />
      <div className="flex flex-col gap-2 rounded-xl border border-emerald-100 bg-white/60 p-4">
        <div className="h-3 w-20 rounded bg-emerald-200/70" />
        <div className="h-3 w-full rounded bg-emerald-100/80" />
        <div className="h-3 w-3/4 rounded bg-emerald-100/70" />
      </div>
      <div className="flex flex-col gap-2 rounded-xl border border-emerald-100 bg-white/60 p-4">
        <div className="h-3 w-24 rounded bg-emerald-200/70" />
        <div className="h-3 w-full rounded bg-emerald-100/80" />
        <div className="h-3 w-2/3 rounded bg-emerald-100/70" />
      </div>
    </div>
  )
}


