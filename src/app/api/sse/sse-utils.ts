declare global {
  var siteSseClients:
    | Map<string, Set<ReadableStreamDefaultController<Uint8Array>>>
    | undefined;
}

export function broadcastGlobal(payload: Record<string, unknown>) {
  if (!global.siteSseClients) return;
  const data = `data: ${JSON.stringify(payload)}\n\n`;
  const enc = new TextEncoder().encode(data);
  for (const set of global.siteSseClients.values()) {
    for (const c of set) {
      try {
        c.enqueue(enc);
      } catch {}
    }
  }
}
