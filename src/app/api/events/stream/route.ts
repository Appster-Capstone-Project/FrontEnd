// src/app/api/events/stream/route.ts
import {NextRequest} from 'next/server';
import {PassThrough} from 'stream';

// This is the backend endpoint we will be proxying to.
const BACKEND_SSE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/stream`;

export const dynamic = 'force-dynamic'; // Ensures this route is not statically built

export async function GET(req: NextRequest) {
  const authToken = req.headers.get('Authorization');

  if (!authToken) {
    console.error('[SSE PROXY] Authorization header is required');
    return new Response('Authorization header is required', {status: 401});
  }

  // Create a transform stream that will be piped to the client.
  const stream = new PassThrough();

  try {
    console.log(`[SSE PROXY] Attempting to connect to backend: ${BACKEND_SSE_URL}`);
    const response = await fetch(BACKEND_SSE_URL, {
      method: 'GET',
      headers: {
        Authorization: authToken,
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok || !response.body) {
      const text = await response.text();
      console.error(
        `[SSE PROXY] Backend connection failed: ${response.status} ${response.statusText}`,
        text
      );
      return new Response(
        `Failed to connect to the backend event stream: ${text}`,
        {status: response.status}
      );
    }

    console.log('[SSE PROXY] Successfully connected to backend stream.');
    const reader = response.body.getReader();

    const push = async () => {
      while (true) {
        const {done, value} = await reader.read();
        if (done) {
          console.log('[SSE PROXY] Backend stream ended.');
          stream.end();
          break;
        }
        stream.write(value);
      }
    };

    push().catch(e => {
      console.error('[SSE PROXY] Error while reading from backend:', e);
      stream.end();
    });

    // Return the stream to the client.
    return new Response(stream as any, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[SSE PROXY] Fetching backend stream failed:', error);
    return new Response('Internal Server Error while connecting to stream', {
      status: 500,
    });
  }
}
