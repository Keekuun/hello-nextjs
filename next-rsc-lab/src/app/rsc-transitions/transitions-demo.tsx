'use client'

import { useState, useTransition, useDeferredValue, useMemo } from 'react'

// 模拟大量数据
const generateItems = (count: number, filter: string) => {
  const items = []
  for (let i = 1; i <= count; i++) {
    const name = `项目 ${i}`
    if (filter === '' || name.toLowerCase().includes(filter.toLowerCase())) {
      items.push({ id: i, name })
    }
  }
  return items
}

// 使用 useTransition 的组件
function FilteredListWithTransition() {
  const [filter, setFilter] = useState('')
  const [isPending, startTransition] = useTransition()
  const [items, setItems] = useState<Array<{ id: number; name: string }>>([])

  const handleFilterChange = (value: string) => {
    setFilter(value)
    // 使用 startTransition 标记非紧急更新
    startTransition(() => {
      const filtered = generateItems(10000, value)
      setItems(filtered)
    })
  }

  return (
    <div className="rounded-lg border border-blue-300 bg-blue-50 p-4">
      <h3 className="mb-3 text-lg font-semibold text-blue-900">useTransition 示例</h3>
      <input
        type="text"
        value={filter}
        onChange={(e) => handleFilterChange(e.target.value)}
        placeholder="搜索项目..."
        className="mb-3 w-full rounded-lg border border-blue-200 px-3 py-2 text-sm"
      />
      {isPending && (
        <div className="mb-2 text-xs text-blue-600">正在过滤...</div>
      )}
      <div className="max-h-48 overflow-auto rounded border border-blue-200 bg-white p-2">
        <ul className="space-y-1 text-sm">
          {items.slice(0, 50).map((item) => (
            <li key={item.id} className="text-slate-700">
              {item.name}
            </li>
          ))}
          {items.length > 50 && (
            <li className="text-xs text-slate-500">... 还有 {items.length - 50} 项</li>
          )}
        </ul>
      </div>
      <p className="mt-2 text-xs text-blue-700">找到 {items.length} 个项目</p>
    </div>
  )
}

// 使用 useDeferredValue 的组件
function FilteredListWithDeferred() {
  const [filter, setFilter] = useState('')
  const deferredFilter = useDeferredValue(filter)

  // 使用 deferredFilter 进行过滤，filter 更新时不会阻塞
  const items = useMemo(() => generateItems(10000, deferredFilter), [deferredFilter])
  const isPending = filter !== deferredFilter

  return (
    <div className="rounded-lg border border-purple-300 bg-purple-50 p-4">
      <h3 className="mb-3 text-lg font-semibold text-purple-900">useDeferredValue 示例</h3>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="搜索项目..."
        className="mb-3 w-full rounded-lg border border-purple-200 px-3 py-2 text-sm"
      />
      {isPending && (
        <div className="mb-2 text-xs text-purple-600">正在更新...</div>
      )}
      <div className="max-h-48 overflow-auto rounded border border-purple-200 bg-white p-2">
        <ul className="space-y-1 text-sm">
          {items.slice(0, 50).map((item) => (
            <li key={item.id} className="text-slate-700">
              {item.name}
            </li>
          ))}
          {items.length > 50 && (
            <li className="text-xs text-slate-500">... 还有 {items.length - 50} 项</li>
          )}
        </ul>
      </div>
      <p className="mt-2 text-xs text-purple-700">找到 {items.length} 个项目</p>
    </div>
  )
}

// 不使用并发特性的对比组件
function FilteredListWithoutTransition() {
  const [filter, setFilter] = useState('')
  const items = useMemo(() => generateItems(10000, filter), [filter])

  return (
    <div className="rounded-lg border border-red-300 bg-red-50 p-4">
      <h3 className="mb-3 text-lg font-semibold text-red-900">无并发特性（对比）</h3>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="搜索项目..."
        className="mb-3 w-full rounded-lg border border-red-200 px-3 py-2 text-sm"
      />
      <div className="max-h-48 overflow-auto rounded border border-red-200 bg-white p-2">
        <ul className="space-y-1 text-sm">
          {items.slice(0, 50).map((item) => (
            <li key={item.id} className="text-slate-700">
              {item.name}
            </li>
          ))}
          {items.length > 50 && (
            <li className="text-xs text-slate-500">... 还有 {items.length - 50} 项</li>
          )}
        </ul>
      </div>
      <p className="mt-2 text-xs text-red-700">找到 {items.length} 个项目</p>
      <p className="mt-1 text-xs text-red-600">
        ⚠️ 输入时可能感觉卡顿，因为每次输入都会同步更新大量数据
      </p>
    </div>
  )
}

export default function TransitionsDemo() {
  return (
    <section className="grid gap-6 rounded-xl border border-slate-200 bg-white p-6">
      <header>
        <h2 className="mb-2 text-xl font-semibold">并发特性对比演示</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          在输入框中快速输入，观察三种实现的响应性差异。
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
        <FilteredListWithTransition />
        <FilteredListWithDeferred />
        <FilteredListWithoutTransition />
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p className="m-0 mb-2 font-semibold">💡 关键观察点：</p>
        <ul className="list-inside list-disc space-y-1">
          <li>
            <strong>useTransition：</strong>输入框保持响应，过滤操作在后台进行，显示 pending 状态
          </li>
          <li>
            <strong>useDeferredValue：</strong>输入框立即更新，列表延迟更新，自动处理过渡
          </li>
          <li>
            <strong>无并发特性：</strong>每次输入都会同步更新，可能导致卡顿
          </li>
          <li>在快速输入时，并发特性可以显著提升用户体验</li>
        </ul>
      </div>
    </section>
  )
}

