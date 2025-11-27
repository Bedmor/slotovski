"use server";

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { revalidatePath } from "next/cache";
import { broadcastRoom } from "./roomSockets";
import { gameRooms } from "./gameRooms";
import type { Card, GameRoom } from "./types";

// Types & gameRooms map moved to separate modules to avoid exporting non-functions from a server action file.

function createDeck(): Card[] {
  const suits: Card["suit"][] = ["hearts", "diamonds", "clubs", "spades"];
  const values: Card["value"][] = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];
  const suitSymbols = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
  };

  const deck: Card[] = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({
        suit,
        value,
        display: `${value}${suitSymbols[suit]}`,
      });
    }
  }

  // Shuffle deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j]!, deck[i]!];
  }

  return deck;
}

function getCardValue(card: Card): number {
  if (card.value === "A") return 11;
  if (["J", "Q", "K"].includes(card.value)) return 10;
  return parseInt(card.value);
}

function calculateHandValue(hand: Card[]): number {
  let value = 0;
  let aces = 0;

  for (const card of hand) {
    const cardValue = getCardValue(card);
    value += cardValue;
    if (card.value === "A") aces++;
  }

  // Adjust for aces
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return value;
}

function advanceToNextActivePlayer(room: GameRoom) {
  while (
    room.currentPlayerIndex < room.players.length &&
    (room.players[room.currentPlayerIndex]!.stand ||
      room.players[room.currentPlayerIndex]!.busted)
  ) {
    room.currentPlayerIndex++;
  }
}

function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function createRoom(maxPlayers = 4) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const roomId = generateRoomId();

  const room: GameRoom = {
    id: roomId,
    players: [],
    dealer: {
      hand: [],
      busted: false,
    },
    deck: createDeck(),
    currentPlayerIndex: 0,
    gameStarted: false,
    gameEnded: false,
    createdAt: Date.now(),
    maxPlayers: Math.min(Math.max(maxPlayers, 1), 6),
  };

  gameRooms.set(roomId, room);
  broadcastRoom(room);

  // Clean up old rooms (older than 1 hour)
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [id, room] of gameRooms.entries()) {
    if (room.createdAt < oneHourAgo) {
      gameRooms.delete(id);
    }
  }

  return { success: true, roomId };
}

export async function joinRoom(roomId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const room = gameRooms.get(roomId.toUpperCase());

  if (!room) {
    return { error: "Room not found" };
  }

  if (room.gameStarted) {
    return { error: "Game already started" };
  }

  if (room.players.length >= room.maxPlayers) {
    return { error: "Room is full" };
  }

  if (room.players.some((p) => p.id === user.id)) {
    return { error: "Already in this room" };
  }

  room.players.push({
    id: user.id,
    name: user.name ?? "Player",
    hand: [],
    bet: 10, // Default bet, can be changed before game starts
    credits: user.credits,
    stand: false,
    busted: false,
    blackjack: false,
  });

  revalidatePath("/blackjack");
  broadcastRoom(room);

  return { success: true, room };
}

export async function updateBet(roomId: string, betAmount: number) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const room = gameRooms.get(roomId.toUpperCase());

  if (!room) {
    return { error: "Room not found" };
  }

  if (room.gameStarted) {
    return { error: "Cannot change bet after game started" };
  }

  const player = room.players.find((p) => p.id === session.user.id);

  if (!player) {
    return { error: "Not in this room" };
  }

  // Allow 0 bet to pass the round
  if (betAmount < 0 || betAmount > player.credits) {
    return { error: "Invalid bet amount" };
  }

  player.bet = betAmount;
  broadcastRoom(room);
  return { success: true, room };
}

export async function startGame(roomId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const room = gameRooms.get(roomId.toUpperCase());

  if (!room) {
    return { error: "Room not found" };
  }

  if (room.players.length === 0) {
    return { error: "No players in room" };
  }

  if (room.gameStarted) {
    return { error: "Game already started" };
  }

  // Deduct bets from active players (bet > 0). Players with bet 0 pass the round.
  for (const player of room.players) {
    if (player.bet > 0) {
      await db.user.update({
        where: { id: player.id },
        data: { credits: { decrement: player.bet } },
      });
      player.credits -= player.bet;
    } else {
      // Pass: mark as stood and ensure empty hand
      player.hand = [];
      player.stand = true;
      player.busted = false;
      player.blackjack = false;
    }
  }

  // Deal initial cards
  room.gameStarted = true;
  room.deck = createDeck();

  // Deal two cards to active players (bet > 0)
  for (const player of room.players) {
    if (player.bet > 0) {
      player.hand = [room.deck.pop()!, room.deck.pop()!];
      const handValue = calculateHandValue(player.hand);
      if (handValue === 21) {
        player.blackjack = true;
        player.stand = true;
      }
    }
  }

  // Deal two cards to dealer (one face down)
  room.dealer.hand = [room.deck.pop()!, room.deck.pop()!];

  // Skip players who already stood/busted (e.g., blackjack) and finish immediately if all done
  advanceToNextActivePlayer(room);
  if (room.currentPlayerIndex >= room.players.length) {
    await finishGame(room);
  }

  broadcastRoom(room);
  return { success: true, room };
}

export async function startNewRound(roomId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const room = gameRooms.get(roomId.toUpperCase());

  if (!room) {
    return { error: "Room not found" };
  }

  if (!room.gameEnded) {
    return { error: "Round not finished yet" };
  }

  // Reset player states, keep bets and credits
  for (const player of room.players) {
    player.hand = [];
    player.stand = false;
    player.busted = false;
    player.blackjack = false;
  }

  // Reset dealer and deck
  room.dealer = { hand: [], busted: false };
  room.deck = createDeck();
  room.currentPlayerIndex = 0;
  room.gameStarted = false;
  room.gameEnded = false;

  revalidatePath("/blackjack");
  broadcastRoom(room);

  return { success: true, room };
}

export async function hit(roomId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const room = gameRooms.get(roomId.toUpperCase());

  if (!room) {
    return { error: "Room not found" };
  }

  if (!room.gameStarted || room.gameEnded) {
    return { error: "Game not active" };
  }

  const currentPlayer = room.players[room.currentPlayerIndex];

  if (!currentPlayer || currentPlayer.id !== session.user.id) {
    return { error: "Not your turn" };
  }

  if (currentPlayer.stand || currentPlayer.busted) {
    return { error: "Cannot hit" };
  }

  // Deal card
  const card = room.deck.pop()!;
  currentPlayer.hand.push(card);

  const handValue = calculateHandValue(currentPlayer.hand);

  if (handValue > 21) {
    currentPlayer.busted = true;
    currentPlayer.stand = true;
    // Move to next player
    room.currentPlayerIndex++;
    advanceToNextActivePlayer(room);
    if (room.currentPlayerIndex >= room.players.length) {
      await finishGame(room);
    }
  }

  broadcastRoom(room);
  return { success: true, room };
}

export async function stand(roomId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const room = gameRooms.get(roomId.toUpperCase());

  if (!room) {
    return { error: "Room not found" };
  }

  if (!room.gameStarted || room.gameEnded) {
    return { error: "Game not active" };
  }

  const currentPlayer = room.players[room.currentPlayerIndex];

  if (!currentPlayer || currentPlayer.id !== session.user.id) {
    return { error: "Not your turn" };
  }

  currentPlayer.stand = true;
  room.currentPlayerIndex++;
  advanceToNextActivePlayer(room);

  // Check if all players are done
  if (room.currentPlayerIndex >= room.players.length) {
    await finishGame(room);
  }
  broadcastRoom(room);
  return { success: true, room };
}

async function finishGame(room: GameRoom) {
  // Dealer plays
  let dealerValue = calculateHandValue(room.dealer.hand);

  while (dealerValue < 17) {
    const card = room.deck.pop()!;
    room.dealer.hand.push(card);
    dealerValue = calculateHandValue(room.dealer.hand);
  }

  if (dealerValue > 21) {
    room.dealer.busted = true;
  }

  // Calculate winners for active players only
  for (const player of room.players) {
    if (player.bet <= 0) continue;
    const playerValue = calculateHandValue(player.hand);
    let winAmount = 0;

    if (
      player.blackjack &&
      !room.dealer.busted &&
      calculateHandValue(room.dealer.hand) !== 21
    ) {
      // Blackjack pays 3:2
      winAmount = Math.floor(player.bet * 2.5);
    } else if (player.busted) {
      winAmount = 0;
    } else if (room.dealer.busted) {
      winAmount = player.bet * 2;
    } else if (playerValue > dealerValue) {
      winAmount = player.bet * 2;
    } else if (playerValue === dealerValue) {
      // Push - return bet
      winAmount = player.bet;
    }

    if (winAmount > 0) {
      await db.user.update({
        where: { id: player.id },
        data: { credits: { increment: winAmount } },
      });
    }
  }

  room.gameEnded = true; // keep final state for a few seconds
  // Do NOT reset immediately; client will trigger startNewRound after delay.
  revalidatePath("/blackjack");
  broadcastRoom(room);
}

export async function getRoom(roomId: string) {
  const room = gameRooms.get(roomId.toUpperCase());
  if (!room) {
    return { error: "Room not found" };
  }
  return { success: true, room };
}

export async function leaveRoom(roomId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const room = gameRooms.get(roomId.toUpperCase());

  if (!room) {
    return { error: "Room not found" };
  }

  if (room.gameStarted) {
    return { error: "Cannot leave during active game" };
  }

  const playerIndex = room.players.findIndex((p) => p.id === session.user.id);

  if (playerIndex === -1) {
    return { error: "Not in this room" };
  }

  room.players.splice(playerIndex, 1);

  // Delete room if empty
  if (room.players.length === 0) {
    gameRooms.delete(roomId.toUpperCase());
  }

  revalidatePath("/blackjack");
  broadcastRoom(room);
  return { success: true };
}

export async function getCredits() {
  const session = await auth();
  if (!session?.user) return 0;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { credits: true },
  });

  return user?.credits ?? 0;
}
