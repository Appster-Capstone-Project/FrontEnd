
import type { NextRequest } from "next/server";

export const dynamic = 'force-dynamic'; // Ensures this route is not statically built

export const GET = async (req: NextRequest) => {
  const token = req.headers.get("authorization"); // get frontend token
  if (!token) {
    console.error('[SSE PROXY] Authorization header missing from client request.');
    return new Response("Unauthorized: Authorization header is required", { status: 401 });
  }

  // Open a server-to-server connection to your backend SSE
  const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/stream`;
  
  console.log(`[SSE PROXY] Attempting to connect to backend: ${backendUrl}`);

  try {
    const backendRes = await fetch(backendUrl, {
      headers: { Authorization: token },
      // @ts-ignore
      duplex: 'half', // Required for streaming with Node.js fetch
    });

    if (!backendRes.ok || !backendRes.body) {
      const errorBody = await backendRes.text();
      console.error(`[SSE PROXY] Backend connection failed with status ${backendRes.status}: ${errorBody}`);
      return new Response(`Backend SSE connection failed: ${errorBody}`, { status: backendRes.status });
    }
    
    console.log('[SSE PROXY] Successfully connected to backend stream. Piping to client.');

    // Pipe the backend SSE stream directly to the frontend
    return new Response(backendRes.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });

  } catch (error) {
    console.error('[SSE PROXY] An unexpected error occurred:', error);
    return new Response('Internal Server Error while connecting to stream', { status: 500 });
  }
};
