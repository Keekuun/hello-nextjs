interface ParallelLabLayoutProps {
  children: React.ReactNode
  metrics: React.ReactNode
  activity: React.ReactNode
  insights: React.ReactNode
}

export default function ParallelLabLayout({
  children,
  metrics,
  activity,
  insights,
}: ParallelLabLayoutProps) {
  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-6 p-6">
      {children}

      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">{metrics}</div>
          <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">{insights}</div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">{activity}</div>
      </section>
    </div>
  )
}


