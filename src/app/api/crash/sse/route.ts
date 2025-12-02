import type { NextRequest } from "next/server";
import type { CrashRoundState } from "../../../crash/types";

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

      // Kick off async round loop if it isn't already running
      if (!global.crashLoopRunning) {
        // Track whether a loop is already running to avoid duplicates
        global.crashLoopRunning = true;
        void (async () => {
          while (true) {
            const state = global.crashState;
            if (!state) break;
            // Wait until there are pending bets
            global.crashState!.phase = "betting";
            global.crashState!.timeLeft = 6; // 6 sec betting
            // Broadcast countdown
            // countdown
            let tl = state.timeLeft ?? 0;
            while (tl > 0) {
              state.timeLeft = tl;
              const data = `data: ${JSON.stringify({ type: "countdown", timeLeft: tl })}\n\n`;
              const encoded = new TextEncoder().encode(data);
              for (const set of global.crashSseClients?.values() ?? []) {
                for (const c of set) {
                  try {
                    c.enqueue(encoded);
                  } catch {
                    /* ignore */
                  }
                }
              }
              await new Promise((r) => setTimeout(r, 1000));
              tl--;
            }
            state.timeLeft = 0;

            // Move pendingBets into activeBets
            state.activeBets = { ...(state.pendingBets ?? {}) };
            state.pendingBets = {};
            state.phase = "running";
            state.running = true;
            state.roundId = Math.random().toString(36).slice(2, 9);
            state.multiplier = 1;

            // Choose crash multiplier (random between min and max, with some bias toward lower values)
            // We pick a min>1.0 so the round has a chance to grow beyond 1x.
            const MIN_CRASH = 1.02; // minimum crash multiplier
            const MAX_CRASH = 25.0; // maximum crash multiplier
            // Use a light power curve to bias toward smaller multipliers while still allowing high outliers.
            const r = Math.random();
            const biased = Math.pow(r, 1.5); // bias toward smaller values
            const finalCrash =
              Math.round((MIN_CRASH + biased * (MAX_CRASH - MIN_CRASH)) * 100) /
              100;

            const tickInterval = 100; //ms
            const growth = 0.01 + Math.random() * 0.04; // growth per tick

            // Broadcast start
            const startData = `data: ${JSON.stringify({ type: "round_start", roundId: global.crashState!.roundId })}\n\n`;
            for (const set of global.crashSseClients?.values() ?? []) {
              for (const c of set) {
                try {
                  c.enqueue(new TextEncoder().encode(startData));
                } catch {}
              }
            }

            // Run ticks
            while (state.multiplier < finalCrash) {
              await new Promise((r) => setTimeout(r, tickInterval));
              if (!state) break;
              state.multiplier =
                Math.round(state.multiplier * (1 + growth) * 100) / 100;
              const tick = `data: ${JSON.stringify({ type: "tick", multiplier: state.multiplier })}\n\n`;
              for (const set of global.crashSseClients!.values()) {
                for (const c of set) {
                  try {
                    c.enqueue(new TextEncoder().encode(tick));
                  } catch {}
                }
              }
            }

            // Crash!
            const crashMult = state.multiplier;
            state.phase = "crashed";
            state.running = false;
            state.history = [crashMult, ...state.history].slice(0, 10);

            const crashData = `data: ${JSON.stringify({ type: "crash", multiplier: crashMult })}\n\n`;
            for (const set of global.crashSseClients?.values() ?? []) {
              for (const c of set) {
                try {
                  c.enqueue(new TextEncoder().encode(crashData));
                } catch {}
              }
            }

            // Clear active bets
            state.activeBets = {};

            // Cooldown for a few seconds before betting starts
            state.phase = "cooldown";
            await new Promise((r) => setTimeout(r, 1500));
            // Continue running even if there are no connected clients.
            // If shutdown is required, we can add a global flag to stop the loop.
          }
        })();
      }
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
