import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '../../../utils/createOpenAIClient';

export async function POST(req: NextRequest) {
  const client = getOpenAIClient();

  try {
    const { action, threadId, message } = await req.json();

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    if (action === 'initialize') {
      const threadId = await client.createThread();
      return NextResponse.json({ threadId });
    }

    if (!threadId) {
      return NextResponse.json({ error: 'Thread ID is required' }, { status: 400 });
    }

    if (action === 'sendMessage') {
      if (!message) {
        return NextResponse.json({ error: 'Message is required' }, { status: 400 });
      }

      await client.addMessage(threadId, message);

      const stream = new ReadableStream({
        async start(controller) {
          await client.runAssistant(threadId, (chunk) => {
            controller.enqueue(`data: ${JSON.stringify({ text: chunk })}\n\n`);
          });
          controller.enqueue(`data: [DONE]\n\n`);
          controller.close();
        },
      });

      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('API Error:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 