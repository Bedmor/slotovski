import type { NextRequest } from "next/server";
import type { CrashRoundState } from "../../../crash/types";
import { startCrashLoopIfNeeded } from "../loop";

declare global {
  var crashSseClients:
    | Map<string, Set<ReadableStreamDefaultController<Uint8Array>>>
    | undefined;
  var crashState: CrashRoundState | undefined;
  var crashLoopRunning: boolean | undefined;
}

export async function GET(request: NextRequest) {
  // Ensure global containers
  global.crashSseClients ??= new Map();
  const clients = global.crashSseClients;
  if (!clients) {
    return new Response("Internal error", { status: 500 });
  }

  const stream = new ReadableStream({
    start(controller) {
      // Add client to set (single key map)
      if (!clients.has("all")) {
        clients.set("all", new Set());
      }
      const s = clients.get("all");
      if (s) s.add(controller as ReadableStreamDefaultController<Uint8Array>);

      // Send initial state
      const state: CrashRoundState = global.crashState ?? {
        running: false,
        multiplier: 1,
        phase: "cooldown",
        activeBets: {},
        pendingBets: {},
        history: [],
      };
      const data = `data: ${JSON.stringify({ type: "state", state })}\n\n`;
      controller.enqueue(new TextEncoder().encode(data));

      request.signal.addEventListener("abort", () => {
        const set = global.crashSseClients!.get("all");
        if (!set) return;
        set.delete(controller as ReadableStreamDefaultController<Uint8Array>);
        if (set.size === 0) global.crashSseClients!.delete("all");
      });

      // Start loop if not started
      // Initialize state object if not present
      global.crashState ??= {
        running: false,
        multiplier: 1,
        phase: "cooldown",
        activeBets: {},
        pendingBets: {},
        history: [],
      } as CrashRoundState;

      // Kick off the centralized crash loop if it isn't already running
      startCrashLoopIfNeeded();
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
