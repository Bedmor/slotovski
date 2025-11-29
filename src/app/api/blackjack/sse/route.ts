import type { NextRequest } from "next/server";
import { loadGameRoom } from "../../../blackjack/gameRooms";

declare global {
  var sseClients: Map<string, Set<ReadableStreamDefaultController>>;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get("roomId")?.toUpperCase();

  if (!roomId) {
    return new Response("Room ID required", { status: 400 });
  }

  const room = await loadGameRoom(roomId);

  if (!room) {
    return new Response("Room not found", { status: 404 });
  }

  // Create SSE stream
  const stream = new ReadableStream({
    start(controller) {
      // Send initial room state
      const data = `data: ${JSON.stringify({ type: "room_update", room })}\n\n`;
      controller.enqueue(new TextEncoder().encode(data));

      // Add this SSE connection to the room's listeners
      if (!global.sseClients) {
        global.sseClients = new Map<
          string,
          Set<ReadableStreamDefaultController>
        >();
      }
      if (!global.sseClients.has(roomId)) {
        global.sseClients.set(roomId, new Set());
      }
      global.sseClients.get(roomId)!.add(controller);

      // Cleanup on disconnect
      request.signal.addEventListener("abort", () => {
        const clients = global.sseClients.get(roomId);
        if (clients) {
          clients.delete(controller);
          if (clients.size === 0) {
            global.sseClients.delete(roomId);
          }
        }
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
