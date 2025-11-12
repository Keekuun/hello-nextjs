export default function MetricsLoading() {
  return (
    <div className="flex animate-pulse flex-col gap-3">
      <div className="h-4 w-32 rounded bg-sky-200/80" />
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-lg border border-sky-100 bg-white/70 px-4 py-3"
        >
          <div className="h-3 w-20 rounded bg-sky-200/70" />
          <div className="h-3 w-14 rounded bg-sky-100/80" />
        </div>
      ))}
    </div>
  )
}


