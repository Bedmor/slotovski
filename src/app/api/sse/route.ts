import type { NextRequest } from "next/server";

declare global {
  var siteSseClients:
    | Map<string, Set<ReadableStreamDefaultController<Uint8Array>>>
    | undefined;
}

export async function GET(request: NextRequest) {
  global.siteSseClients ??= new Map();

  const stream = new ReadableStream({
    start(controller: ReadableStreamDefaultController<Uint8Array>) {
      // key per client role or all - use single 'all' key
      if (!global.siteSseClients!.has("all")) {
        global.siteSseClients!.set("all", new Set());
      }
      const set = global.siteSseClients!.get("all")!;
      set.add(controller);

      // cleanup on abort
      request.signal.addEventListener("abort", () => {
        set.delete(controller);
        if (set.size === 0) global.siteSseClients!.delete("all");
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
