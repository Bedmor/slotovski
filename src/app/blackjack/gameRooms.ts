import type { Card, GameRoom, Player } from "./types";
import { db } from "~/server/db";

// Database-backed game room storage
export async function saveGameRoom(room: GameRoom) {
  await db.gameRoom.upsert({
    where: { id: room.id },
    update: {
      players: JSON.stringify(room.players),
      dealer: JSON.stringify(room.dealer),
      deck: JSON.stringify(room.deck),
      currentPlayerIndex: room.currentPlayerIndex,
      gameStarted: room.gameStarted,
      gameEnded: room.gameEnded,
      maxPlayers: room.maxPlayers,
    },
    create: {
      id: room.id,
      players: JSON.stringify(room.players),
      dealer: JSON.stringify(room.dealer),
      deck: JSON.stringify(room.deck),
      currentPlayerIndex: room.currentPlayerIndex,
      gameStarted: room.gameStarted,
      gameEnded: room.gameEnded,
      maxPlayers: room.maxPlayers,
    },
  });
}

export async function loadGameRoom(roomId: string): Promise<GameRoom | null> {
  const dbRoom = (await db.gameRoom.findUnique({
    where: { id: roomId.toUpperCase() },
  })) as {
    id: string;
    players: string;
    dealer: string;
    deck: string;
    currentPlayerIndex: number;
    gameStarted: boolean;
    gameEnded: boolean;
    createdAt: Date;
    maxPlayers: number;
  } | null;

  if (!dbRoom) return null;

  return {
    id: dbRoom.id,
    players: Array.isArray(dbRoom.players)
      ? dbRoom.players
      : JSON.parse(dbRoom.players) as Player[],
    dealer:
      typeof dbRoom.dealer === "object"
        ? dbRoom.dealer
        : JSON.parse(dbRoom.dealer) as GameRoom["dealer"],
    deck: Array.isArray(dbRoom.deck) ? dbRoom.deck : JSON.parse(dbRoom.deck) as Card[],
    currentPlayerIndex: dbRoom.currentPlayerIndex,
    gameStarted: dbRoom.gameStarted,
    gameEnded: dbRoom.gameEnded,
    createdAt:
      dbRoom.createdAt instanceof Date
        ? dbRoom.createdAt.getTime()
        : Date.now(),
    maxPlayers: dbRoom.maxPlayers,
  };
}

export async function deleteGameRoom(roomId: string) {
  await db.gameRoom.delete({
    where: { id: roomId.toUpperCase() },
  });
}

// Clean up old rooms (older than 1 hour)
export async function cleanupOldRooms() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  await db.gameRoom.deleteMany({
    where: {
      createdAt: {
        lt: oneHourAgo,
      },
    },
  });
}
