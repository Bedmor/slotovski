import type { GameRoom } from "../../../blackjack/types";

declare global {
  var sseClients: Map<string, Set<ReadableStreamDefaultController>>;
}

// Broadcast to SSE clients
export function broadcastRoomSSE(roomId: string, room: GameRoom) {
  if (!global.sseClients?.has(roomId)) return;

  const data = `data: ${JSON.stringify({ type: "room_update", room })}\n\n`;
  const encodedData = new TextEncoder().encode(data);

  for (const controller of global.sseClients.get(roomId)!) {
    try {
      controller.enqueue(encodedData);
    } catch {
      // Client disconnected, will be cleaned up
    }
  }
}
