import type { NextRequest } from "next/server";
import { getCrashState, ensureCrashEngine } from "~/app/crash/engine";

declare global {
  var crashSseClients:
    | Set<ReadableStreamDefaultController<Uint8Array>>
    | undefined;
}

export async function GET(request: NextRequest) {
  // Make sure engine is running so we have a state to send
  ensureCrashEngine();
  const state = getCrashState();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      // send initial state
      const data = `data: ${JSON.stringify({ type: "crash_update", state })}\n\n`;
      controller.enqueue(new TextEncoder().encode(data));

      global.crashSseClients ??= new Set();
      global.crashSseClients.add(controller);

      request.signal.addEventListener("abort", () => {
        global.crashSseClients?.delete(controller);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
