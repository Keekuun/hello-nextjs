import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // 用于判断连接是否已关闭
      let isClosed = false;

      // 监听客户端断开连接
      request.signal.addEventListener('abort', () => {
        console.log('Client disconnected');
        isClosed = true;
        controller.close();
      });

      // 发送连接建立消息
      if (!isClosed) {
        controller.enqueue(encoder.encode('data: Connected\n\n'));
      }

      // 每秒发送数据
      const timer = setInterval(() => {
        if (isClosed) return;

        const data = {
          timestamp: new Date().toISOString(),
          message: 'Hello from SSE!'
        };

        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }, 1000);

      // 10秒后自动关闭连接
      setTimeout(() => {
        if (!isClosed) {
          console.log('Closing connection after 10 seconds');
          controller.close();
          isClosed = true;
        }
      }, 10000);

      // 清理函数
      return () => {
        clearInterval(timer);
      };
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
