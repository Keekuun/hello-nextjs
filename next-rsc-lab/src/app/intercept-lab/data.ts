export interface LabItem {
  id: string
  title: string
  summary: string
  description: string
  flightFocus: string
}

export const labItems: LabItem[] = [
  {
    id: 'flight',
    title: 'Flight 渲染日志',
    summary: '查看最新 Flight chunk，理解客户端模块解析流程。',
    description:
      '通过拦截路由，我们可以在不离开当前页面的情况下查看 Flight payload 与模块引用信息。这对于调试并行数据流和客户端组件加载顺序十分关键。',
    flightFocus: 'Flight chunk 在网络层的传输与解析过程。',
  },
  {
    id: 'cache',
    title: '缓存刷新记录',
    summary: '追踪 revalidateTag 与 unstable_cache 的失效轨迹。',
    description:
      '展示在仪表盘中执行缓存刷新操作的时间线、触发源以及受影响的路由段。在拦截路由中的模态窗口可以快速预览详情，再决定是否跳转到完整页面。',
    flightFocus: 'Server Actions 对缓存层的影响与并行区域刷新效果。',
  },
  {
    id: 'edge',
    title: 'Edge 请求轨迹',
    summary: '分析 Edge Runtime 中的请求头与 Region 路径变化。',
    description:
      '结合 Edge Runtime 日志，展示请求的地域信息、响应耗时及 fallback 情况。模态视图适合随时查看详情，完整页面提供更深入的排查步骤。',
    flightFocus: '不同 Region 的响应耗时与 fallback 策略。',
  },
]

export function getLabItem(id: string): LabItem | undefined {
  return labItems.find((item) => item.id === id)
}


