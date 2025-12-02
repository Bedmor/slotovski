"use client";

import { useState, useEffect, useRef } from "react";
import { Users, Plus, Copy, Check } from "lucide-react";
import {
  createRoom,
  joinRoom,
  startGame,
  hit,
  stand,
  leaveRoom,
  updateBet,
  startNewRound,
} from "./actions";
import type { GameRoom, Card, Player } from "./types";
import Link from "next/link";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface BlackjackGameProps {
  initialCredits: number;
  userId: string;
}

export default function BlackjackGame({
  initialCredits,
  userId,
}: BlackjackGameProps) {
  const { width, height } = useWindowSize();
  const [credits] = useState(initialCredits);
  const [screen, setScreen] = useState<"lobby" | "room">("lobby");
  const [roomId, setRoomId] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [localBet, setLocalBet] = useState(10);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);
  const [nextRoundCountdown, setNextRoundCountdown] = useState<number | null>(
    null,
  );
  const countdownRef = useRef<number | null>(null);

  // SSE connection for real-time updates
  const eventSourceRef = useRef<EventSource | null>(null);
  // Global site SSE for notification broadcasts
  const siteEventSourceRef = useRef<EventSource | null>(null);
  useEffect(() => {
    if (screen !== "room" || !roomId) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    try {
      const url = `/api/blackjack/sse?roomId=${roomId}`;
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;
      eventSource.onmessage = (event: MessageEvent) => {
        try {
          const parsed = JSON.parse(event.data as string) as {
            type: string;
            room?: GameRoom;
            message?: string;
          };
          if (parsed.type === "room_update" && parsed.room) {
            setRoom(parsed.room);
            if (!parsed.room.gameStarted) {
              const me: Player | undefined = parsed.room.players.find(
                (p: Player) => p.id === userId,
              );
              if (me) setLocalBet(me.bet);
            }
          } else if (parsed.type === "error") {
            setMessage({ text: parsed.message ?? "SSE error", type: "error" });
          }
        } catch {
          // ignore malformed JSON
        }
      };
      eventSource.onerror = () => {
        setMessage({ text: "SSE error", type: "error" });
      };
    } catch (err) {
      console.error("Failed to init SSE", err);
      setMessage({ text: "Realtime unavailable", type: "error" });
    }
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [screen, roomId, userId]);

  // Connect to global SSE for site-wide notifications
  useEffect(() => {
    try {
      const evt = new EventSource(`/api/sse`);
      siteEventSourceRef.current = evt;
      evt.onmessage = (ev: MessageEvent) => {
        try {
          const parsed = JSON.parse(ev.data as string) as Record<
            string,
            unknown
          > | null;
          if (parsed?.type === "player_cashed_out") {
            const pidRaw = parsed.playerId as string | number | undefined;
            const pid =
              typeof pidRaw === "string"
                ? pidRaw
                : typeof pidRaw === "number"
                  ? String(pidRaw)
                  : "";
            const payout = Number(
              (parsed.payout ?? parsed.amount ?? 0) as number,
            );
            if (!pid) return;
            if (pid === userId) {
              setMessage({
                text: `You won ${payout} credits!`,
                type: "success",
              });
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 5000);
            } else {
              setMessage({
                text: `Player ${pid} cashed out ${payout} credits`,
                type: "info",
              });
              setTimeout(() => setMessage(null), 3000);
            }
          }
        } catch {}
      };
    } catch {}
    return () => {
      if (siteEventSourceRef.current) {
        siteEventSourceRef.current.close();
        siteEventSourceRef.current = null;
      }
    };
  }, [userId]);

  // Trigger countdown when gameEnded becomes true
  useEffect(() => {
    if (room?.gameEnded) {
      // Start a 3 second countdown
      setNextRoundCountdown(5);
      if (countdownRef.current) {
        window.clearInterval(countdownRef.current);
      }
      countdownRef.current = window.setInterval(() => {
        setNextRoundCountdown((prev) => {
          if (prev === null) return prev;
          if (prev <= 1) {
            window.clearInterval(countdownRef.current!);
            countdownRef.current = null;
            // Automatically start new round
            void (async () => {
              setMessage({ text: "Starting next round...", type: "info" });
              const result = await startNewRound(room.id);
              if ("error" in result) {
                setMessage({
                  text: result.error ?? "Failed to start new round",
                  type: "error",
                });
              } else {
                setRoom(result.room);
                const me = result.room.players.find(
                  (p: Player) => p.id === userId,
                );
                if (me) setLocalBet(me.bet);
                setMessage({ text: "New round ready!", type: "success" });
                setTimeout(() => setMessage(null), 2000);
              }
            })();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Clear if leaving game-ended state
      if (countdownRef.current) {
        window.clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      setNextRoundCountdown(null);
    }
  }, [room?.gameEnded, room?.id, userId]);

  const handleCreateRoom = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await createRoom(maxPlayers);
      setRoomId(result.roomId);

      // Automatically join the created room
      const joinResult = await joinRoom(result.roomId);
      if ("error" in joinResult) {
        setMessage({
          text: joinResult.error ?? "Failed to join created room",
          type: "error",
        });
      } else {
        setRoom(joinResult.room);
        setScreen("room");
        const joinedPlayer = joinResult.room.players.find(
          (p: Player) => p.id === userId,
        );
        if (joinedPlayer) {
          setLocalBet(joinedPlayer.bet);
        }
        setMessage({
          text: `Room created! ID: ${result.roomId}`,
          type: "success",
        });
      }
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : "Failed to create room",
        type: "error",
      });
    }

    setIsLoading(false);
  };

  const handleJoinRoom = async () => {
    if (!joinRoomId.trim()) {
      setMessage({ text: "Please enter a room ID", type: "error" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const result = await joinRoom(joinRoomId);

    if ("error" in result) {
      setMessage({
        text: result.error ?? "Failed to join room",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    setRoom(result.room);
    setRoomId(result.room.id);
    setScreen("room");
    const joinedPlayer = result.room.players.find(
      (p: Player) => p.id === userId,
    );
    if (joinedPlayer) {
      setLocalBet(joinedPlayer.bet);
    }
    setMessage({
      text: "Joined room successfully! Set your bet below.",
      type: "success",
    });
    setIsLoading(false);
  };

  const handleStartGame = async () => {
    if (!roomId) return;

    setIsLoading(true);
    const result = await startGame(roomId);

    if ("error" in result) {
      setMessage({
        text: result.error ?? "Failed to start game",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    setRoom(result.room);
    setMessage({ text: "Game started! Good luck!", type: "success" });
    setIsLoading(false);
  };

  const handleHit = async () => {
    if (!roomId) return;

    setIsLoading(true);
    const result = await hit(roomId);

    if ("error" in result) {
      setMessage({ text: result.error ?? "Failed to hit", type: "error" });
      setIsLoading(false);
      return;
    }

    setRoom(result.room);
    setIsLoading(false);
  };

  const handleStand = async () => {
    if (!roomId) return;

    setIsLoading(true);
    const result = await stand(roomId);

    if ("error" in result) {
      setMessage({ text: result.error ?? "Failed to stand", type: "error" });
      setIsLoading(false);
      return;
    }

    setRoom(result.room);
    setIsLoading(false);

    if (result.room.gameEnded) {
      const currentPlayer = result.room.players.find((p) => p.id === userId);
      if (currentPlayer && !currentPlayer.busted) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }
  };

  const handleLeaveRoom = async () => {
    if (!roomId) return;

    const result = await leaveRoom(roomId);

    if ("error" in result) {
      setMessage({
        text: result.error ?? "Failed to leave room",
        type: "error",
      });
      return;
    }

    setRoom(null);
    setRoomId("");
    setScreen("lobby");
    setMessage({ text: "Left room", type: "info" });
  };

  const handleConfirmBet = async () => {
    if (!roomId || !room) return;

    const currentPlayer = room.players.find((p) => p.id === userId);
    if (!currentPlayer) return;

    // Clamp and normalize bet to valid bounds and step
    const normalizedBet = Math.min(
      currentPlayer.credits,
      Math.max(10, Math.floor(localBet / 10) * 10),
    );

    if (normalizedBet === currentPlayer.bet) {
      setMessage({ text: "Bet unchanged", type: "info" });
      setTimeout(() => setMessage(null), 1500);
      return;
    }

    setIsLoading(true);
    const result = await updateBet(roomId, normalizedBet);

    if ("error" in result) {
      setMessage({
        text: result.error ?? "Failed to update bet",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    setRoom(result.room);
    setLocalBet(normalizedBet);
    setMessage({
      text: `Bet confirmed: ${normalizedBet} credits`,
      type: "success",
    });
    setTimeout(() => setMessage(null), 2000);
    setIsLoading(false);
  };

  const copyRoomId = () => {
    if (roomId) {
      void navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const calculateHandValue = (hand: Card[]): number => {
    let value = 0;
    let aces = 0;

    for (const card of hand) {
      if (card.value === "A") {
        value += 11;
        aces++;
      } else if (["J", "Q", "K"].includes(card.value)) {
        value += 10;
      } else {
        value += parseInt(card.value);
      }
    }

    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }

    return value;
  };

  const getCardColor = (suit: Card["suit"]) => {
    return suit === "hearts" || suit === "diamonds"
      ? "text-red-500"
      : "text-gray-900";
  };

  const currentPlayer = room?.players.find((p) => p.id === userId);
  const isCurrentTurn = room?.players[room.currentPlayerIndex]?.id === userId;

  // Small animated card component for entry & reveal animations
  function AnimatedCard({
    card,
    faceDown = false,
    reveal = false,
    className = "",
  }: {
    card: Card;
    faceDown?: boolean;
    reveal?: boolean;
    className?: string;
  }) {
    const [shown, setShown] = useState(false);
    const [flash, setFlash] = useState(false);
    useEffect(() => {
      const id = setTimeout(() => setShown(true), 10);
      return () => clearTimeout(id);
    }, []);

    useEffect(() => {
      let t: number | undefined;
      if (reveal) {
        setFlash(true);
        t = window.setTimeout(() => setFlash(false), 700);
      }
      return () => {
        if (t) window.clearTimeout(t);
      };
    }, [reveal]);

    return (
      <div
        className={`flex h-20 w-12 shrink-0 flex-col items-center justify-center rounded-lg border-2 shadow-lg transition-all duration-300 md:h-24 md:w-14 lg:h-28 lg:w-16 ${
          faceDown ? "border-gray-600 bg-gray-800" : "border-gray-300 bg-white"
        } ${className} ${
          shown
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-2 scale-95 opacity-0"
        } ${reveal ? "-translate-y-1 scale-105 transform-gpu" : ""} ${flash ? "-translate-y-1 scale-110" : ""}`}
      >
        {faceDown ? (
          <div className={`text-xl sm:text-2xl`}>🂠</div>
        ) : (
          <>
            <div
              className={`text-xl font-bold sm:text-2xl ${getCardColor(card.suit)}`}
            >
              {card.value}
            </div>
            <div className={`text-sm sm:text-xl ${getCardColor(card.suit)}`}>
              {card.display.slice(-1)}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-linear-to-b from-[#1a0b2e] to-[#0f0f1a] p-2 pt-16 pb-24 font-sans text-white sm:p-4 sm:pt-20 sm:pb-8">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <Link
        href="/"
        className="absolute top-2 left-2 flex items-center gap-2 rounded-lg bg-purple-800/50 px-3 py-2 text-sm font-bold transition-colors hover:bg-purple-700 sm:top-4 sm:left-4 sm:px-4"
      >
        🏠 Home
      </Link>

      <div className="mb-4 text-center sm:mb-8">
        <h1 className="bg-linear-to-r from-purple-400 to-pink-600 bg-clip-text text-3xl font-extrabold tracking-tighter text-transparent drop-shadow-lg sm:text-4xl md:text-6xl">
          BLACKJACK
        </h1>
        <p className="mt-1 text-base text-purple-300 sm:mt-2 sm:text-lg">
          Multiplayer 21
        </p>
      </div>

      {screen === "lobby" ? (
        <div className="flex w-full max-w-4xl flex-col gap-4 px-2">
          <div className="rounded-2xl border-2 border-purple-900 bg-black/80 p-4 shadow-2xl sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-purple-300 sm:text-2xl">
                Game Lobby
              </h2>
              <div className="text-right">
                <div className="text-sm text-gray-400">Credits</div>
                <div className="text-2xl font-bold text-yellow-400">
                  {credits}
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Create Room */}
              <div className="rounded-xl border border-purple-700 bg-purple-900/20 p-4">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-purple-300">
                  <Plus className="h-5 w-5" />
                  Create Room
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm text-gray-400">
                      Max Players: {maxPlayers}
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="6"
                      value={maxPlayers}
                      onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-purple-900 accent-purple-500"
                    />
                  </div>

                  <button
                    onClick={handleCreateRoom}
                    disabled={isLoading}
                    className="w-full rounded-lg bg-purple-600 px-4 py-3 font-bold uppercase transition-all hover:bg-purple-500 disabled:opacity-50"
                  >
                    {isLoading ? "Creating..." : "Create Room"}
                  </button>

                  {roomId && (
                    <div className="rounded-lg bg-green-900/30 p-3">
                      <div className="mb-2 text-sm text-gray-400">
                        Room ID (Share with friends)
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 rounded bg-black/50 px-3 py-2 text-lg font-bold text-green-400">
                          {roomId}
                        </code>
                        <button
                          onClick={copyRoomId}
                          className="rounded bg-green-600 p-2 transition-colors hover:bg-green-500"
                        >
                          {copied ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <Copy className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Mobile fixed bet control bar (visible when in room and game not started) */}
                  {currentPlayer && !room?.gameStarted && (
                    <div className="fixed right-0 bottom-0 left-0 z-50 sm:hidden">
                      <div className="mx-3 mb-3 flex items-center justify-between gap-3 rounded-t-lg bg-black/80 px-3 py-2 shadow-lg">
                        <div className="flex items-center gap-2">
                          <button
                            aria-label="Decrease bet"
                            onClick={() =>
                              setLocalBet((prev) =>
                                Math.max(10, Math.floor((prev - 10) / 10) * 10),
                              )
                            }
                            className="rounded bg-purple-700 px-3 py-2 text-sm font-bold transition-colors hover:bg-purple-600"
                          >
                            -
                          </button>
                          <div className="rounded bg-black/50 px-4 py-2 text-lg font-bold">
                            {localBet}
                          </div>
                          <button
                            aria-label="Increase bet"
                            onClick={() =>
                              setLocalBet((prev) =>
                                Math.min(
                                  credits,
                                  Math.floor((prev + 10) / 10) * 10,
                                ),
                              )
                            }
                            className="rounded bg-purple-700 px-3 py-2 text-sm font-bold transition-colors hover:bg-purple-600"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const half = Math.max(
                                10,
                                Math.floor(localBet / 2 / 10) * 10,
                              );
                              setLocalBet(half);
                            }}
                            className="rounded bg-yellow-700 px-3 py-2 text-sm font-bold transition-colors hover:bg-yellow-600"
                          >
                            1/2x
                          </button>
                          <button
                            onClick={() => {
                              const doubled = Math.min(
                                credits,
                                Math.floor((localBet * 2) / 10) * 10,
                              );
                              setLocalBet(doubled);
                            }}
                            className="rounded bg-yellow-700 px-3 py-2 text-sm font-bold transition-colors hover:bg-yellow-600"
                          >
                            2x
                          </button>
                          <button
                            onClick={handleConfirmBet}
                            disabled={isLoading}
                            className="rounded bg-green-600 px-4 py-2 text-sm font-bold transition-colors hover:bg-green-500 disabled:opacity-50"
                          >
                            {isLoading ? "Confirming..." : "Confirm"}
                          </button>
                          <button
                            onClick={() => setLocalBet(currentPlayer.bet)}
                            className="rounded bg-red-600 px-3 py-2 text-sm font-bold transition-colors hover:bg-red-500"
                          >
                            Revert
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Join Room */}
              <div className="rounded-xl border border-cyan-700 bg-cyan-900/20 p-4">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-cyan-300">
                  <Users className="h-5 w-5" />
                  Join Room
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm text-gray-400">
                      Room ID
                    </label>
                    <input
                      type="text"
                      value={joinRoomId}
                      onChange={(e) =>
                        setJoinRoomId(e.target.value.toUpperCase())
                      }
                      placeholder="Enter room ID"
                      className="w-full rounded-lg border border-cyan-700 bg-black/50 px-4 py-3 text-lg font-bold text-white uppercase placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                      maxLength={6}
                    />
                  </div>

                  <button
                    onClick={handleJoinRoom}
                    disabled={isLoading || !joinRoomId.trim()}
                    className="w-full rounded-lg bg-cyan-600 px-4 py-3 font-bold uppercase transition-all hover:bg-cyan-500 disabled:opacity-50"
                  >
                    {isLoading ? "Joining..." : "Join Room"}
                  </button>

                  <p className="text-xs text-gray-500">
                    You can set your bet amount after joining
                  </p>
                </div>
              </div>
            </div>

            {message && (
              <div
                className={`mt-4 rounded-lg p-3 text-center font-bold ${
                  message.type === "success"
                    ? "bg-green-900/50 text-green-300"
                    : message.type === "error"
                      ? "bg-red-900/50 text-red-300"
                      : "bg-blue-900/50 text-blue-300"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>

          {/* How to Play */}
          <div className="rounded-2xl border-2 border-purple-900 bg-black/80 p-4 sm:p-6">
            <h3 className="mb-3 text-xl font-bold text-purple-300">
              How to Play
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Create a room or join with a room ID</li>
              <li>• Wait for other players to join</li>
              <li>• First player starts the game</li>
              <li>• Get as close to 21 as possible without going over</li>
              <li>• Blackjack (21 with 2 cards) pays 3:2</li>
              <li>• Beat the dealer to win!</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-6xl px-2">
          <div className="rounded-2xl border-2 border-purple-900 bg-black/80 p-4 shadow-2xl sm:p-6">
            {/* Room Header */}
            <div className="mb-4 flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-purple-300">
                    Room: {roomId}
                  </h2>
                  <button
                    onClick={copyRoomId}
                    className="rounded bg-purple-700 p-1 transition-colors hover:bg-purple-600"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="text-sm text-gray-400">
                  {room?.players.length ?? 0}/{room?.maxPlayers ?? 0} Players
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="rounded-md bg-black/30 px-3 py-1 text-sm font-bold text-yellow-400">
                  Credits: {credits}
                </div>
                {!room?.gameStarted && (
                  <>
                    <button
                      onClick={handleStartGame}
                      disabled={isLoading || (room?.players.length ?? 0) === 0}
                      className="rounded-lg bg-green-600 px-4 py-2 font-bold transition-all hover:bg-green-500 disabled:opacity-50"
                    >
                      Start Game
                    </button>
                    <button
                      onClick={handleLeaveRoom}
                      className="rounded-lg bg-red-600 px-4 py-2 font-bold transition-all hover:bg-red-500"
                    >
                      Leave
                    </button>
                  </>
                )}
                {room?.gameEnded && nextRoundCountdown !== null && (
                  <div className="rounded-lg bg-purple-800 px-4 py-2 text-sm font-bold text-purple-100">
                    Next round in {nextRoundCountdown}s
                  </div>
                )}
              </div>
            </div>

            {/* Bet Adjustment - Before Game Starts */}
            {currentPlayer && !room?.gameStarted && (
              <div className="mb-4 hidden rounded-xl border-2 border-yellow-600 bg-yellow-900/20 p-4 sm:block">
                <div className="mb-3 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="animate-pulse text-2xl">💰</span>
                      <h3 className="text-lg font-bold text-yellow-400">
                        {localBet} Credits
                      </h3>
                    </div>
                    {localBet !== currentPlayer.bet && (
                      <span className="animate-bounce rounded-full bg-red-600 px-2 py-1 text-xs font-bold">
                        Not Confirmed
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">
                    Available: {credits} Credits
                  </p>
                  {currentPlayer.bet !== localBet && (
                    <p className="mt-1 text-xs text-yellow-400">
                      Current confirmed bet: {currentPlayer.bet}
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="10"
                    max={credits}
                    step="10"
                    value={localBet}
                    onChange={(e) => setLocalBet(parseInt(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-purple-900 accent-yellow-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>10</span>
                    <span>{credits}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        const half = Math.max(
                          10,
                          Math.floor(localBet / 2 / 10) * 10,
                        );
                        setLocalBet(half);
                      }}
                      className="rounded bg-yellow-700 px-2 py-1 text-sm font-bold transition-colors hover:bg-yellow-600"
                    >
                      1/2x
                    </button>
                    <button
                      onClick={() => {
                        const doubled = Math.min(
                          credits,
                          Math.floor((localBet * 2) / 10) * 10,
                        );
                        setLocalBet(doubled);
                      }}
                      className="rounded bg-yellow-700 px-2 py-1 text-sm font-bold transition-colors hover:bg-yellow-600"
                    >
                      2x
                    </button>
                  </div>
                  {localBet !== currentPlayer.bet && (
                    <button
                      onClick={handleConfirmBet}
                      disabled={isLoading}
                      className="w-full rounded-lg bg-green-600 px-4 py-3 font-bold uppercase transition-all hover:bg-green-500 disabled:opacity-50"
                    >
                      {isLoading ? "Confirming..." : "Confirm Bet"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Dealer's Hand */}
            {room?.gameStarted && (
              <div className="mb-6 rounded-xl border-2 border-yellow-600 bg-yellow-900/20 p-4">
                <div className="mb-2 flex items-center justify-between gap-3 text-lg font-bold text-yellow-400">
                  <div className="flex items-center gap-3">Dealer</div>
                  {room.gameEnded && (
                    <span className="text-sm">
                      (
                      {room.dealer.busted
                        ? "BUSTED"
                        : calculateHandValue(room.dealer.hand)}
                      )
                    </span>
                  )}
                </div>
                <div className="flex w-full items-center justify-center gap-2 overflow-auto px-1 py-2">
                  {room.dealer.hand.map((card, idx) => (
                    <AnimatedCard
                      key={`${card.display}-${idx}`}
                      card={card}
                      faceDown={!room.gameEnded && idx === 1}
                      reveal={room.gameEnded && idx === 1}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Players */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {room?.players.map((player, idx) => {
                const handValue = calculateHandValue(player.hand);
                const isCurrentPlayer = player.id === userId;
                const isTurn =
                  room.currentPlayerIndex === idx && !room.gameEnded;
                // Determine winner (exclude pushes) when game ended
                let isWinner = false;
                let winAmount = 0;
                if (room.gameEnded && !player.busted && player.bet > 0) {
                  const dealerValue = calculateHandValue(room.dealer.hand);
                  const dealerBusted = room.dealer.busted;
                  if (dealerBusted) {
                    isWinner = true;
                    winAmount = player.bet * 2;
                  } else {
                    if (player.blackjack && dealerValue !== 21) {
                      isWinner = true;
                      winAmount = Math.floor(player.bet * 2.5);
                    } else if (handValue > dealerValue) {
                      isWinner = true;
                      winAmount = player.bet * 2;
                    } else if (handValue === dealerValue) {
                      // push => not winner, bet returned
                      isWinner = false;
                      winAmount = player.bet;
                    }
                  }
                }

                return (
                  <div
                    key={player.id}
                    className={`flex min-h-[150px] w-full flex-col justify-between rounded-xl border-2 p-3 sm:p-4 ${
                      isCurrentPlayer
                        ? "border-cyan-500 bg-cyan-900/30"
                        : isTurn
                          ? "border-yellow-500 bg-yellow-900/30"
                          : "border-purple-700 bg-purple-900/20"
                    } ${isWinner && winAmount > 0 ? "animate-pulse ring-2 ring-green-400" : ""}`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="truncate font-bold text-white">
                          {player.name}
                          {isCurrentPlayer && " (You)"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {player.credits}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isTurn && (
                          <div className="rounded-full bg-yellow-500 px-3 py-1.5 text-sm font-bold text-black">
                            YOUR TURN
                          </div>
                        )}
                        {isWinner && winAmount > 0 && (
                          <div className="flex flex-col items-end gap-0.5">
                            <div className="flex items-center gap-1 text-xs font-bold text-yellow-300">
                              <span className="animate-gentleSparkle">
                                {player.blackjack ? "🌟" : "✨"}
                              </span>
                              {player.blackjack ? "BLACKJACK!" : "WIN"}
                            </div>
                            <div className="text-xs font-bold text-green-400">
                              +{winAmount} credits
                            </div>
                          </div>
                        )}
                        {room.gameEnded &&
                          handValue === calculateHandValue(room.dealer.hand) &&
                          !player.busted &&
                          player.bet > 0 && (
                            <div className="text-xs font-bold text-blue-400">
                              PUSH
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="mb-2 text-sm text-gray-400">
                      Bet: {player.bet} •{" "}
                      {room.gameStarted ? (
                        player.busted ? (
                          <span className="text-red-400">BUSTED</span>
                        ) : player.blackjack ? (
                          <span className="text-yellow-400">BLACKJACK!</span>
                        ) : player.stand ? (
                          <span className="text-blue-400">
                            STAND ({handValue})
                          </span>
                        ) : (
                          <span className="text-green-400">
                            Value: {handValue}
                          </span>
                        )
                      ) : (
                        "Waiting..."
                      )}
                    </div>

                    {player.hand.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1">
                        {player.hand.map((card, cardIdx) => (
                          <AnimatedCard
                            key={`${player.id}-${card.display}-${cardIdx}`}
                            card={card}
                            className="h-12 w-10 rounded border-2 border-gray-300 bg-white shadow sm:h-16 sm:w-12 md:h-20 md:w-14"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            {currentPlayer &&
              room?.gameStarted &&
              !room.gameEnded &&
              isCurrentTurn &&
              !currentPlayer.stand && (
                <div className="fixed bottom-4 left-1/2 z-40 mt-6 flex w-[calc(100%-32px)] -translate-x-1/2 flex-col items-center justify-center gap-3 sm:static sm:bottom-auto sm:left-auto sm:w-auto sm:translate-x-0 sm:flex-row sm:gap-4">
                  <button
                    onClick={handleHit}
                    disabled={isLoading}
                    className="w-full rounded-lg bg-green-600 px-6 py-3 text-lg font-bold uppercase transition-all hover:bg-green-500 disabled:opacity-50 sm:w-auto sm:text-xl"
                  >
                    Hit
                  </button>
                  <button
                    onClick={handleStand}
                    disabled={isLoading}
                    className="w-full rounded-lg bg-red-600 px-6 py-3 text-lg font-bold uppercase transition-all hover:bg-red-500 disabled:opacity-50 sm:w-auto sm:text-xl"
                  >
                    Stand
                  </button>
                </div>
              )}

            {message && (
              <div
                className={`mt-4 rounded-lg p-3 text-center font-bold ${
                  message.type === "success"
                    ? "bg-green-900/50 text-green-300"
                    : message.type === "error"
                      ? "bg-red-900/50 text-red-300"
                      : "bg-blue-900/50 text-blue-300"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
