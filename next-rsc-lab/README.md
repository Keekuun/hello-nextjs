## 项目简介

`next-rsc-lab` 是一个最小可运行的 Next.js App Router 实验室，用来拆解 React Server Components（RSC）的底层机制。你可以通过动手操作验证以下关键流程：

- 服务器组件在 Node 侧执行并生成 Flight 数据包
- Flight 协议如何描述组件树、Props、客户端模块引用
- 浏览器接收初始 HTML 并触发客户端组件的水合与增量加载
- `no-store` 等缓存策略对 RSC 渲染的影响

## 快速上手

```bash
pnpm install
pnpm dev
```

访问 `http://localhost:3000`，进入首页后点击「进入 RSC Demo」按钮即可跳转至实验页面 `/rsc-demo`。

> **建议环境**：Node.js ≥ 18，使用 Chrome DevTools 观察网络请求与日志更直观。

## 实验页面结构

```
src/app/rsc-demo/
├── page.tsx         # ServerPage：负责获取数据和组装页面
├── server-child.tsx # ServerChild：嵌套的服务器组件
└── client-button.tsx# ClientButton：客户端组件，验证水合
src/app/rsc-streaming/
├── page.tsx               # StreamingPage：Suspense + 流式输出示例
├── slow-server-panel.tsx  # 人为延迟的 Server Component，触发流式补全
└── client-hydration-marker.tsx # Client Component，记录水合时间
src/app/rsc-actions/
├── page.tsx               # ActionsPage：Server Action + 表单交互入口
├── actions.ts             # `'use server'` 定义，负责处理表单并返回结果
├── form-panel.tsx         # 使用 useActionState 的客户端组件，触发表单提交
├── form-submit-button.tsx # Client Component，利用 useFormStatus 展示 pending 状态
└── result-stream.tsx      # 服务器组件，展示最新提交历史
src/app/rsc-edge/
├── page.tsx               # EdgeRuntimePage：强制运行在 Edge Runtime 的 RSC 页面
└── client-edge-marker.tsx # 客户端组件，记录 Edge 页面水合时间与交互
src/app/rsc-flight-viewer/
├── page.tsx               # FlightViewerPage：Flight 数据可视化工具入口
└── flight-viewer-client.tsx # 客户端组件，解析和可视化 Flight 数据包结构
src/app/rsc-performance/
├── page.tsx                    # PerformancePage：性能监控页面入口
└── performance-monitor-client.tsx # 客户端组件，收集和展示性能指标
src/app/rsc-ppr/
├── page.tsx               # PprDemoPage：Partial Prerendering 实验入口
├── static-summary.tsx     # 采用强缓存的服务器组件，展示静态内容
└── dynamic-insights.tsx   # 使用 `cache: 'no-store'` 的动态组件，结合 Suspense 流式输出
src/app/rsc-actions-optimistic/
├── page.tsx               # OptimisticActionsPage：useOptimistic + Server Actions 实验入口
├── actions.ts             # createNote/listNotes，模拟后端校验与延迟
└── notes-board.tsx        # 客户端组件，演示 useOptimistic 和 useTransition
src/app/rsc-flight-recorder/
├── page.tsx               # FlightRecorderPage：实时捕获 Flight chunk 的入口
└── recorder-client.tsx    # 客户端组件，轮询 window.__next_f 并展示 chunk
src/app/rsc-cache-lab/
├── page.tsx               # CacheLabPage：对比 revalidateTag、unstable_cache 与实时数据
├── data.ts                # 数据源定义，包含缓存策略与实时脉冲
├── actions.ts             # Server Actions，调用 revalidateTag / revalidatePath
├── cache-control-panel.tsx# 客户端控制台，触发缓存刷新
├── cached-quote.tsx       # 展示带 tag 的缓存 Fetch 结果
├── insight-metrics.tsx    # 展示 unstable_cache 的计算结果
└── live-pulse.tsx         # 无缓存的实时数据对照
src/app/api-lifecycle/
├── page.tsx               # ApiLifecyclePage：汇总 headers/cookies/draftMode、展示 API Playground
├── components/
│   └── ApiPlayground.tsx  # 客户端组件，发起 fetch 并记录日志
└── api/
    ├── echo/route.ts      # Route Handler，回显请求上下文
    └── stream/route.ts    # Route Handler，ReadableStream 分块输出
middleware.ts               # Edge Middleware，拦截 /api-lifecycle 下的请求
instrumentation.ts          # register 钩子，记录启动时机
```

- `ServerPage`：通过 `fetch` 拉取 `https://jsonplaceholder.typicode.com/todos/1`，并在服务器端输出日志，确保每次请求都执行服务器渲染。
- `ServerChild`：在服务器端生成时间戳并打印日志，帮助你确认嵌套服务器组件会分别出现在 Flight 数据中。
- `ClientButton`：以 `"use client"` 标记，点击后会触发客户端 JS chunk 的下载与水合流程。
- `StreamingPage`：展示 Suspense fallback 先行返回、真实数据延迟补全的 streaming 流程。
- `SlowServerPanel`：用 `setTimeout` 模拟慢速数据源，便于抓取 Flight 分片。
- `ClientHydrationMarker`：利用 `useEffect` 输出水合时间与交互日志。
- `ActionsPage`：集中展示表单提交、Server Action 执行与 Flight 状态回传。
- `actions.ts`：通过 `'use server'` 声明的处理函数，模拟耗时任务并调用 `revalidatePath`。
- `form-panel.tsx`：使用 `useActionState` 捕获 server action 返回值，渲染成功或错误状态。
- `result-stream.tsx`：读取内存中的最近提交，呈现 Flight 触发的最新列表。
- `EdgeRuntimePage`：演示 RSC 在 Edge Runtime 环境下的执行上下文、网络能力和日志。
- `client-edge-marker.tsx`：记录 Edge 页面水合时间，验证客户端交互是否正常。
- `fetchGeoInfoFromApi`：调用 `https://ipapi.co/json/` 获取实时地理信息，失败时回退 Edge 请求头。
- `FlightViewerPage`：提供交互式工具，帮助解析和可视化 Flight 数据包的结构。
- `flight-viewer-client.tsx`：解析 Flight JSON 数据，以树形结构展示组件节点、Props 和客户端引用。
- `PerformancePage`：实时监控 RSC 渲染性能，包括 FCP、FP、水合时间等关键指标。
- `performance-monitor-client.tsx`：使用 Performance API 收集指标，提供颜色编码的性能报告。
- `PprDemoPage`：展示 Partial Prerendering，静态内容在构建期生成，动态内容请求时流式补全。
- `static-summary.tsx`：使用 `cache: 'force-cache'` 获取数据，展示可复用的静态部分。
- `dynamic-insights.tsx`：模拟慢接口并通过 `cache: 'no-store'` 返回实时数据，配合 Suspense fallback。
- `OptimisticActionsPage`：示范如何结合 useOptimistic 与 Server Actions 实现乐观更新。
- `notes-board.tsx`：客户端组件，使用 useOptimistic/useTransition 管理临时笔记列表。
- `FlightRecorderPage`：自动捕获浏览器内的 Flight chunk，方便对比调试。
- `recorder-client.tsx`：轮询 `window.__next_f` 并提供解析、清除、暂停捕获等操作。
- `ApiLifecyclePage`：结合 headers/cookies/draftMode 展示请求上下文，提供 Playground 调用 Route Handler。
- `ApiPlayground.tsx`：客户端组件，演示调用 Echo/Stream Route Handler 并展示响应日志。
- `echo/route.ts`：Route Handler 回显请求信息，设定缓存头。
- `stream/route.ts`：创建 ReadableStream，模拟 Flight 分块输出。
- `middleware.ts`：Edge 中间件，记录请求并注入自定义 Header。
- `instrumentation.ts`：演示 register 钩子在启动时触发。

## 观察步骤

1. **服务器日志**  
   在运行 `pnpm dev` 的终端中刷新 `/rsc-demo`，可以看到：

   ```
   [RSC] ServerPage fetchTitle result: {...}
   [RSC] ServerChild render at 2025-11-10T08:12:34.567Z
   ```

   说明 Server Component 在服务器执行。

2. **抓取 Flight 数据**  
   - 打开 Chrome DevTools → Network → 访问 `/rsc-demo`  
   - 找到带有 `?__rsc` 或 `?__flight` 的请求  
   - 在 Response 面板中可以看到 Flight chunk，包含组件节点数组与 `ClientButton` 的引用信息

3. **查看 HTML 首屏**  
   - 在同一个文档请求 `/rsc-demo` 的 Response 中，确认 `<h1>`、`<p>` 等 DOM 已经在服务器渲染完成

4. **验证客户端水合**  
   - 打开浏览器 Console，点击「点我查看客户端渲染」按钮  
   - 首次点击时 Network 面板会出现 `client-button` 对应的 JS chunk  
   - 说明客户端组件根据 Flight 提示完成增量加载与水合

5. **检查 Flight 缓存**  
   在 Console 中执行：
   ```js
   window.__next_f
   ```
   可以看到开发模式下缓存的 Flight 片段数组。

6. **流式输出与水合时序**  
   - 访问 `/rsc-streaming`，留意终端中 `[RSC][Streaming]` 相关日志  
   - Network 面板中观察 `?__rsc` 的分块返回：fallback 先行发送，约 3 秒后补齐真实数据  
   - `ClientHydrationMarker` 在 Console 输出 `[Hydration]` 日志，记录水合完成与交互时间点  
   - 利用 DevTools Performance 录制，可对比 fallback 展现与客户端水合的时间差

7. **Server Action Flight 回传**  
   - 打开 `/rsc-actions`，填写表单并提交  
   - 关注终端中 `[Server Action]` 日志，确认服务器收到与处理时间  
   - Network → 过滤 `?__rsc`，可以看到表单结果封装在 Flight 数据里返回，并携带新的列表节点  
   - `form-panel` 会即时显示 server action 返回的状态；`result-stream` 因 `revalidatePath('/rsc-actions')` 被触发而刷新，印证服务器推送的最新数据。

8. **Flight 数据可视化**  
   - 访问 `/rsc-flight-viewer`，打开任意 RSC 页面（如 `/rsc-demo`）  
   - 在 Network 面板中找到 `?__rsc` 请求，复制 Response 内容  
   - 将数据粘贴到 Flight 可视化工具的输入框，点击"解析 Flight 数据"  
   - 工具会以树形结构展示组件节点，高亮客户端组件引用，并可展开查看 Props 详情  
   - 帮助你直观理解 Flight 协议如何编码组件树和模块引用

9. **性能监控与分析**  
   - 访问 `/rsc-performance`，页面会自动收集性能指标  
   - 查看 FCP（首次内容绘制）、FP（首次绘制）、水合时间等关键指标  
   - 指标会根据性能表现用颜色编码（绿色=优秀，黄色=一般，红色=需优化）  
   - 结合 Chrome DevTools Performance 面板录制，可以更详细地分析渲染时间线

10. **Edge Runtime 对比实验**  
    - 访问 `/rsc-edge`，该页面强制运行在 Edge Runtime  
    - 打开终端日志，留意 `[Edge Runtime]` 输出，验证执行上下文  
    - 页面优先调用 `https://ipapi.co/json/` 获取地理信息（城市、国家、时区、运营商、IP），若失败则回退 Edge 请求头  
    - 观察 `fetch` 调用耗时，体会 Edge Runtime 的低延迟网络能力  
    - 客户端组件 `ClientEdgeMarker` 会记录水合时间，并在 Console 打印日志

11. **Partial Prerendering（PPR）**  
    - 访问 `/rsc-ppr`，该页面设置 `revalidate = 120`，静态部分在构建期生成  
    - `StaticSummary` 使用 `cache: 'force-cache'`，命中缓存时服务器日志会提示  
    - `DynamicInsights` 通过 `cache: 'no-store'` 在请求时拉取实时引用，模拟 2.5 秒延迟  
    - Suspense fallback 立即返回，真实数据流式补全，观察终端 `[PPR]` 日志和 Network 中的分段响应  
    - 多次刷新对比静态段是否复用缓存、动态段是否重新生成

12. **Server Actions 乐观更新**  
    - 打开 `/rsc-actions-optimistic`，输入 4 个字符以上的内容并快速提交多次  
    - 注意新条目会立即出现并标记为“等待服务器确认”，稍后替换为真实记录  
    - 试着提交过短的内容，观察 useOptimistic 如何回滚临时条目并显示错误信息  
    - 查看终端中 `[Server Action]` 日志，验证 revalidatePath 是否被触发

13. **Flight Recorder 自动捕获**  
    - 打开 `/rsc-flight-recorder`，保持页面运行  
    - 在新标签页访问其他 RSC 页面并触发操作（如刷新或提交表单）  
    - 返回 Recorder 页即可看到 chunk 实时追加，可点选查看 JSON 结构  
    - 支持暂停捕获、清空记录，方便针对特定操作做精确比对

14. **Next.js API 生命周期实验**  
    - 访问 `/api-lifecycle`，查看服务器组件对 headers/cookies/draftMode 的读数  
    - 使用页面下方 Playground 调用 `/api-lifecycle/api/echo` 与 `/api-lifecycle/api/stream`，观察日志  
    - 在终端留意 middleware 输出的请求信息以及响应头 `x-middleware-request-id`  
    - 阅读 `instrumentation.ts` 的日志，了解 register 钩子何时被调用

15. **RSC 缓存策略实验**  
    - 打开 `/rsc-cache-lab`，先记录卡片显示的引用、指标与实时脉冲时间  
    - 点击「刷新缓存的引用」按钮，Server Action 会执行 `revalidateTag('cached-quote')`，稍后只刷新引用卡片  
    - 点击「刷新计算指标」按钮，观察 `unstable_cache` 绑定的 `insight-metrics` tag 被强制失效，新的耗时与 Fibonacci 采样会更新  
    - 点击「刷新全部并重新渲染页面」，触发 `revalidatePath('/rsc-cache-lab')`，所有缓存组件与实时脉冲共同刷新，终端会输出 `[CacheLab]` 日志对比缓存命中与实时计算耗时

## 进阶探索

- **调试服务器执行**：使用 `NODE_OPTIONS="--inspect" pnpm dev`，在 `chrome://inspect` 中连接 Node 进程，对 `.next/server/app/rsc-demo/page.js` 打断点。
- **构建产物对照**：运行 `pnpm build` 后，比较 `.next/server/app/rsc-demo/page.js`（服务器 bundle）与 `.next/static/chunks/app/rsc-demo/client-button.js`（客户端 bundle），查阅 `client-reference-manifest.json` 理解客户端模块映射。
- **扩展实验**：
  - 增加 `Suspense` 或 `ErrorBoundary`，观察 Flight 流式输出
  - 编写 `'use server'` 的 Server Actions，研究表单提交后的 Flight 结构
  - 在 Edge Runtime 中部署，比较日志与 Flight 差异

## 常见问题

| 问题 | 排查建议 |
| ---- | -------- |
| 刷新后没有触发服务器日志 | 确认 `fetch` 使用了 `cache: 'no-store'`，或清除浏览器缓存 |
| 看不到 `?__rsc` 请求 | Next.js 版本不同可能参数名不同，搜索 Network 中的 `rsc` / `flight` 字样 |
| 客户端按钮不可点击 | 检查浏览器控制台是否有 JS 报错，确认页面启用了 JS |

## 工具与资源

- **Flight 数据可视化工具** (`/rsc-flight-viewer`)：帮助解析和理解 Flight 数据包结构
- **性能监控面板** (`/rsc-performance`)：实时监控 RSC 渲染性能指标
- **缓存策略实验室** (`/rsc-cache-lab`)：掌握 `revalidateTag`、`unstable_cache` 与实时数据的协同刷新流程

## 下一步规划

- 添加 Edge Runtime 实验，对比 Node.js Runtime 和 Edge Runtime 的差异
- 补充 Partial Prerendering 等高级案例，构成完整的 RSC 学习路径
- 增强 Flight 可视化工具，支持实时捕获和自动解析 Flight 数据
- 添加性能对比功能，对比不同缓存策略对性能的影响
- 探索 Service Worker 与 RSC 缓存联动，进一步完善离线与实时刷新策略
