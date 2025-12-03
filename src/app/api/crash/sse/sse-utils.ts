import type { CrashState } from "../../../crash/types";

declare global {
  // Single channel for crash game
  var crashSseClients:
    | Set<ReadableStreamDefaultController<Uint8Array>>
    | undefined;
}

export function broadcastCrash(state: CrashState) {
  if (!global.crashSseClients || global.crashSseClients.size === 0) return;
  const payload = { type: "crash_update", state };
  const data = `data: ${JSON.stringify(payload)}\n\n`;
  const enc = new TextEncoder().encode(data);
  for (const controller of global.crashSseClients) {
    try {
      controller.enqueue(enc);
    } catch {
      // Ignore; client will be cleaned on abort
    }
  }
}
