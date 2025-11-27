export const runtime = "edge";

import { gameRooms } from "../gameRooms";
import { addSocketToRoom, removeSocketFromRoom } from "../roomSockets";

// Minimal Edge WebSocketPair typing and ResponseInit extension
interface AcceptedWebSocket extends WebSocket {
  accept(): void;
}
declare class WebSocketPair {
  0: WebSocket;
  1: AcceptedWebSocket;
  constructor();
}
declare global {
  interface ResponseInit {
    webSocket?: WebSocket;
  }
}

export async function GET(request: Request) {
  if (request.headers.get("upgrade") !== "websocket") {
    return new Response("Expected websocket", { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const roomId = (searchParams.get("roomId") ?? "").toUpperCase();
  if (!roomId) {
    return new Response("Missing roomId", { status: 400 });
  }

  const pair = new WebSocketPair();
  const client = pair[0];
  const server = pair[1];
  server.accept();

  addSocketToRoom(roomId, server);

  const room = gameRooms.get(roomId);
  if (room) {
    server.send(JSON.stringify({ type: "room_update", room }));
  } else {
    server.send(JSON.stringify({ type: "error", message: "Room not found" }));
  }

  server.addEventListener("message", (event: MessageEvent) => {
    // Currently stateless client -> server messages; could add ping logic
    if (event.data === "ping") {
      server.send("pong");
    }
  });

  server.addEventListener("close", () => {
    removeSocketFromRoom(roomId, server);
  });

  // Edge runtime: return upgraded socket
  return new Response(null, {
    status: 101,
    headers: { Upgrade: "websocket" },
    webSocket: client,
  });
}
