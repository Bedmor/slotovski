import type { CrashRoundState } from "../../crash/types";

declare global {
  var crashSseClients:
    | Map<string, Set<ReadableStreamDefaultController<Uint8Array>>>
    | undefined;
  var crashState: CrashRoundState | undefined;
  var crashLoopRunning: boolean | undefined;
}

function broadcast(payload: Record<string, unknown>) {
  if (!global.crashSseClients) return;
  const data = `data: ${JSON.stringify(payload)}\n\n`;
  const enc = new TextEncoder().encode(data);
  for (const set of global.crashSseClients.values()) {
    for (const c of set) {
      try {
        c.enqueue(enc);
      } catch {}
    }
  }
}

export function startCrashLoopIfNeeded() {
  if (global.crashLoopRunning) return;
  global.crashLoopRunning = true;
  void (async () => {
    try {
      // Initialize state if needed
      global.crashState ??= {
        running: false,
        multiplier: 1,
        phase: "cooldown",
        activeBets: {},
        pendingBets: {},
        history: [],
      } as CrashRoundState;

      while (true) {
        const state = global.crashState;
        if (!state) break;

        // Betting phase
        state.phase = "betting";
        state.timeLeft = 6;
        let tl = state.timeLeft ?? 0;
        while (tl > 0) {
          state.timeLeft = tl;
          broadcast({ type: "countdown", timeLeft: tl });
          await new Promise((r) => setTimeout(r, 1000));
          tl--;
        }
        state.timeLeft = 0;
        // Broadcast state after countdown/pending collect so clients can update attendees
        broadcast({ type: "state", state: global.crashState });

        // Move pending to active
        state.activeBets = { ...(state.pendingBets ?? {}) };
        state.pendingBets = {};
        state.phase = "running";
        state.running = true;
        state.roundId = Math.random().toString(36).slice(2, 9);
        state.multiplier = 1;

        // Multiplier generation
        const MIN_CRASH = 1.02;
        const MAX_CRASH = 25.0;
        const r = Math.random();
        const biased = Math.pow(r, 1.5);
        const finalCrash =
          Math.round((MIN_CRASH + biased * (MAX_CRASH - MIN_CRASH)) * 100) /
          100;

        const tickInterval = 100;
        const growth = 0.01 + Math.random() * 0.04;

        // Broadcast start
        broadcast({ type: "round_start", roundId: state.roundId });
        // Broadcast the new state so clients know about activeBets -> attendees
        broadcast({ type: "state", state: global.crashState });

        // Run ticks
        while (state.multiplier < finalCrash) {
          await new Promise((r) => setTimeout(r, tickInterval));
          if (!state) break;
          state.multiplier =
            Math.round(state.multiplier * (1 + growth) * 100) / 100;
          broadcast({ type: "tick", multiplier: state.multiplier });
        }

        // Crash
        const crashMult = state.multiplier;
        state.phase = "crashed";
        state.running = false;
        state.history = [crashMult, ...state.history].slice(0, 10);
        broadcast({ type: "crash", multiplier: crashMult });

        // Clear active bets
        state.activeBets = {};
        // Broadcast the state update after clearing active bets
        broadcast({ type: "state", state: global.crashState });

        // Cooldown
        state.phase = "cooldown";
        await new Promise((r) => setTimeout(r, 1500));
      }
    } catch (err) {
      console.error("Crash loop error:", err);
    } finally {
      global.crashLoopRunning = false;
    }
  })();
}

// file ends here
