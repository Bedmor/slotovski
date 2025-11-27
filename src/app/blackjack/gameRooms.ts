import type { GameRoom } from "./types";

// In-memory storage for game rooms (in production, use Redis or similar)
export const gameRooms = new Map<string, GameRoom>();
