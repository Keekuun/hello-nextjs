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
├── form-panel.tsx         # 使用 useFormState 的服务器组件，触发表单提交
├── form-submit-button.tsx # Client Component，利用 useFormStatus 展示 pending 状态
└── result-stream.tsx      # 服务器组件，展示最新提交历史
```

- `ServerPage`：通过 `fetch` 拉取 `https://jsonplaceholder.typicode.com/todos/1`，并在服务器端输出日志，确保每次请求都执行服务器渲染。
- `ServerChild`：在服务器端生成时间戳并打印日志，帮助你确认嵌套服务器组件会分别出现在 Flight 数据中。
- `ClientButton`：以 `"use client"` 标记，点击后会触发客户端 JS chunk 的下载与水合流程。
- `StreamingPage`：展示 Suspense fallback 先行返回、真实数据延迟补全的 streaming 流程。
- `SlowServerPanel`：用 `setTimeout` 模拟慢速数据源，便于抓取 Flight 分片。
- `ClientHydrationMarker`：利用 `useEffect` 输出水合时间与交互日志。
- `ActionsPage`：集中展示表单提交、Server Action 执行与 Flight 状态回传。
- `actions.ts`：通过 `'use server'` 声明的处理函数，模拟耗时任务并调用 `revalidatePath`。
- `form-panel.tsx`：使用 `useFormState` 捕获 server action 返回值，渲染成功或错误状态。
- `result-stream.tsx`：读取内存中的最近提交，呈现 Flight 触发的最新列表。

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

## 下一步规划

- 引入可视化时间线，展示 Flight 到达、HTML ready、Hydration complete 的时序
- 补充 Server Actions、Partial Prerendering 等高级案例，构成完整的 RSC 学习路径
