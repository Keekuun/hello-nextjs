'use client'

import { use, Suspense, useState } from 'react'

type UserData = { id: number; name: string; email: string; fetchedAt: string }
type UserPost = { id: number; title: string; fetchedAt: string }

// 模拟异步数据获取
function fetchUserData(userId: number): Promise<UserData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: `用户 ${userId}`,
        email: `user${userId}@example.com`,
        fetchedAt: new Date().toLocaleTimeString(),
      })
    }, 1500)
  })
}

function fetchUserPosts(userId: number): Promise<UserPost[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fetchedAt = new Date().toLocaleTimeString()
      resolve([
        { id: 1, title: `用户 ${userId} 的第一篇文章`, fetchedAt },
        { id: 2, title: `用户 ${userId} 的第二篇文章`, fetchedAt },
      ])
    }, 2000)
  })
}

const userDataCache = new Map<number, Promise<UserData>>()
const userPostsCache = new Map<number, Promise<UserPost[]>>()

function getUserDataPromise(userId: number) {
  const cached = userDataCache.get(userId)
  if (cached) {
    return cached
  }
  const promise = fetchUserData(userId).then((data) => {
    userDataCache.set(userId, Promise.resolve(data))
    return data
  })
  userDataCache.set(userId, promise)
  return promise
}

function getUserPostsPromise(userId: number) {
  const cached = userPostsCache.get(userId)
  if (cached) {
    return cached
  }
  const promise = fetchUserPosts(userId).then((data) => {
    userPostsCache.set(userId, Promise.resolve(data))
    return data
  })
  userPostsCache.set(userId, promise)
  return promise
}

function invalidateUserData(userId: number) {
  userDataCache.delete(userId)
}

function invalidateUserPosts(userId: number) {
  userPostsCache.delete(userId)
}

// 使用 use() Hook 的组件
function UserProfile({ userId }: { userId: number }) {
  const userData = use(getUserDataPromise(userId))

  return (
    <div className="rounded-lg border border-green-300 bg-green-50 p-4">
      <h3 className="mb-2 text-lg font-semibold text-green-900">{userData.name}</h3>
      <p className="text-sm text-green-700">ID: {userData.id}</p>
      <p className="text-sm text-green-700">邮箱: {userData.email}</p>
      <p className="mt-2 text-xs text-green-600">数据获取时间：{userData.fetchedAt}</p>
    </div>
  )
}

// 条件使用 use() Hook
function UserPostsContent({ userId }: { userId: number }) {
  const posts = use(getUserPostsPromise(userId))

  return (
    <div className="rounded-lg border border-purple-300 bg-purple-50 p-4">
      <h3 className="mb-2 text-lg font-semibold text-purple-900">用户文章</h3>
      <ul className="list-inside list-disc space-y-1 text-sm text-purple-700">
        {posts.map((post) => (
          <li key={post.id}>
            <span>{post.title}</span>
            <span className="ml-2 text-xs text-purple-500">({post.fetchedAt})</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ConditionalUserPosts({ userId, shouldLoad }: { userId: number; shouldLoad: boolean }) {
  // use() 仍然在子组件中使用，外层可以做条件判断
  if (!shouldLoad) {
    return (
      <div className="rounded-lg border border-slate-300 bg-slate-50 p-4 text-slate-500">
        未加载文章数据
      </div>
    )
  }

  return <UserPostsContent userId={userId} />
}

export default function UseHookDemo() {
  const [userId, setUserId] = useState(1)
  const [shouldLoadPosts, setShouldLoadPosts] = useState(false)

  return (
    <section className="grid gap-6 rounded-xl border border-slate-200 bg-white p-6">
      <header>
        <h2 className="mb-2 text-xl font-semibold">use() Hook 演示</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          切换用户 ID 或点击加载文章，观察 use() Hook 如何与 Suspense 配合工作。
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            const nextId = userId === 1 ? 2 : 1
            invalidateUserData(nextId)
            invalidateUserPosts(nextId)
            setUserId(nextId)
          }}
          className="rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
        >
          切换用户 ID (当前: {userId})
        </button>
        <button
          type="button"
          onClick={() => {
            const next = !shouldLoadPosts
            if (next) {
              invalidateUserPosts(userId)
            }
            setShouldLoadPosts(next)
          }}
          className="rounded-lg border border-purple-300 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-100"
        >
          {shouldLoadPosts ? '隐藏' : '加载'}文章
        </button>
      </div>

      <div className="grid gap-4">
        <Suspense
          fallback={
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-center text-amber-700">
              <p className="m-0">正在加载用户数据...</p>
            </div>
          }
        >
          <UserProfile userId={userId} />
        </Suspense>

        <Suspense
          fallback={
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-center text-amber-700">
              <p className="m-0">正在加载文章数据...</p>
            </div>
          }
        >
          <ConditionalUserPosts userId={userId} shouldLoad={shouldLoadPosts} />
        </Suspense>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p className="m-0 mb-2 font-semibold">💡 关键观察点：</p>
        <ul className="list-inside list-disc space-y-1">
          <li>use() Hook 直接使用 Promise，无需 useEffect 或 useState</li>
          <li>条件使用：只有在 shouldLoadPosts 为 true 时才会调用 use()</li>
          <li>Suspense fallback 在 Promise pending 时自动显示</li>
          <li>切换 userId 时，Suspense 会重新触发，显示新的加载状态</li>
        </ul>
      </div>
    </section>
  )
}

