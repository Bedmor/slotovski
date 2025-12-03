import type { NextRequest } from "next/server";
import { getCrashState, ensureCrashEngine } from "~/app/crash/engine";

declare global {
  var crashSseClients:
    | Set<ReadableStreamDefaultController<Uint8Array>>
    | undefined;
}

export async function GET(request: NextRequest) {
  // Make sure engine is running so we have a state to send
  await ensureCrashEngine();
  let state: unknown;
  try {
    state = await getCrashState();
  } catch (err) {
    // Convert errors into a safe, serializable object so we don't assign an error-typed value.
    state = { error: err instanceof Error ? err.message : String(err) };
  }

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
