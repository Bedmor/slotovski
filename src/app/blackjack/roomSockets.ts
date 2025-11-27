import type { GameRoom } from "./types";

// Map of roomId -> set of websocket connections
export const roomSocketMap = new Map<string, Set<WebSocket>>();

export function addSocketToRoom(roomId: string, ws: WebSocket) {
  const id = roomId.toUpperCase();
  let set = roomSocketMap.get(id);
  if (!set) {
    set = new Set<WebSocket>();
    roomSocketMap.set(id, set);
  }
  set.add(ws);
}

export function removeSocketFromRoom(roomId: string, ws: WebSocket) {
  const id = roomId.toUpperCase();
  const set = roomSocketMap.get(id);
  if (!set) return;
  set.delete(ws);
  if (set.size === 0) roomSocketMap.delete(id);
}

export function broadcastRoom(room: GameRoom) {
  const set = roomSocketMap.get(room.id.toUpperCase());
  if (!set) return;
  const payload = JSON.stringify({ type: "room_update", room });
  for (const ws of set) {
    try {
      ws.send(payload);
    } catch {
      // ignore send errors
    }
  }
}
