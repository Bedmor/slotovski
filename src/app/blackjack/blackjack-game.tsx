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
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#1a0b2e] to-[#0f0f1a] p-4 text-white sm:p-8">
      {showConfetti && <Confetti width={width} height={height} />}

      {/* Header */}
      <div className="mb-4 flex w-full max-w-6xl items-center justify-between sm:mb-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-sm font-bold text-purple-300 backdrop-blur-md transition hover:bg-black/60 hover:text-white sm:px-6 sm:py-3 sm:text-base"
        >
          ← Back
        </Link>
        <h1 className="bg-linear-to-r from-purple-400 to-pink-600 bg-clip-text text-2xl font-black tracking-tighter text-transparent drop-shadow-[0_0_10px_rgba(192,132,252,0.5)] sm:text-4xl md:text-5xl">
          BLACKJACK
        </h1>
        <div className="w-20 sm:w-[100px]"></div> {/* Spacer */}
      </div>

      {screen === "lobby" ? (
        <div className="flex w-full max-w-6xl flex-col gap-8 lg:flex-row lg:items-start">
          {/* Main Lobby Panel */}
          <div className="flex flex-1 flex-col gap-6 rounded-3xl border border-purple-500/20 bg-black/40 p-6 shadow-[0_0_50px_rgba(168,85,247,0.15)] backdrop-blur-md sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Game Lobby
              </h2>
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold tracking-wider text-purple-400/70 uppercase">
                  Credits
                </span>
                <span className="text-2xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">
                  {credits}
                </span>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Create Room */}
              <div className="flex flex-col gap-4 rounded-2xl border border-purple-500/20 bg-purple-900/20 p-6 transition-all hover:border-purple-500/40 hover:bg-purple-900/30">
                <h3 className="flex items-center gap-2 text-xl font-bold text-purple-300">
                  <Plus className="h-6 w-6" />
                  Create Room
                </h3>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold tracking-widest text-purple-400 uppercase">
                      Max Players: {maxPlayers}
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="6"
                      value={maxPlayers}
                      onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-purple-900/50 accent-purple-500 hover:accent-purple-400"
                    />
                    <div className="flex justify-between text-xs font-medium text-purple-400/50">
                      <span>2 Players</span>
                      <span>6 Players</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCreateRoom}
                    disabled={isLoading}
                    className="w-full rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-6 py-4 font-black tracking-wider text-white uppercase shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? "Creating..." : "Create Room"}
                  </button>

                  {roomId && (
                    <div className="animate-fade-in rounded-xl border border-green-500/20 bg-green-900/20 p-4">
                      <div className="mb-2 text-xs font-bold tracking-wider text-green-400/70 uppercase">
                        Room ID (Share with friends)
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 rounded-lg bg-black/40 px-4 py-3 text-center text-xl font-black tracking-widest text-green-400">
                          {roomId}
                        </code>
                        <button
                          onClick={copyRoomId}
                          className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600/20 text-green-400 transition-colors hover:bg-green-600 hover:text-white"
                        >
                          {copied ? (
                            <Check className="h-6 w-6" />
                          ) : (
                            <Copy className="h-6 w-6" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Join Room */}
              <div className="flex flex-col gap-4 rounded-2xl border border-cyan-500/20 bg-cyan-900/20 p-6 transition-all hover:border-cyan-500/40 hover:bg-cyan-900/30">
                <h3 className="flex items-center gap-2 text-xl font-bold text-cyan-300">
                  <Users className="h-6 w-6" />
                  Join Room
                </h3>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold tracking-widest text-cyan-400 uppercase">
                      Room ID
                    </label>
                    <input
                      type="text"
                      value={joinRoomId}
                      onChange={(e) =>
                        setJoinRoomId(e.target.value.toUpperCase())
                      }
                      placeholder="ENTER ID"
                      className="w-full rounded-xl border border-cyan-500/30 bg-black/40 px-4 py-3 text-xl font-black text-white uppercase placeholder-cyan-900/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                      maxLength={6}
                    />
                  </div>

                  <button
                    onClick={handleJoinRoom}
                    disabled={isLoading || !joinRoomId.trim()}
                    className="w-full rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 px-6 py-4 font-black tracking-wider text-white uppercase shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? "Joining..." : "Join Room"}
                  </button>

                  <p className="text-center text-xs font-medium text-cyan-400/50">
                    You can set your bet amount after joining
                  </p>
                </div>
              </div>
            </div>

            {message && (
              <div
                className={`animate-fade-in mt-4 rounded-xl border p-4 text-center font-bold backdrop-blur-md ${
                  message.type === "success"
                    ? "border-green-500/30 bg-green-900/30 text-green-300"
                    : message.type === "error"
                      ? "border-red-500/30 bg-red-900/30 text-red-300"
                      : "border-blue-500/30 bg-blue-900/30 text-blue-300"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>

          {/* Side Panel - How to Play */}
          <div className="flex w-full max-w-md flex-col gap-6 rounded-3xl border border-purple-500/20 bg-black/40 p-6 shadow-xl backdrop-blur-md lg:w-80">
            <h3 className="text-sm font-bold tracking-widest text-purple-400 uppercase">
              How to Play
            </h3>
            <ul className="space-y-4 text-sm text-purple-100/70">
              <li className="flex items-start gap-3">
                <span className="text-xl">🏠</span>
                <span>Create a room or join with a room ID</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">👥</span>
                <span>Wait for other players to join</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">▶️</span>
                <span>First player starts the game</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">🎯</span>
                <span>Get as close to 21 as possible without going over</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">🃏</span>
                <span>Blackjack (21 with 2 cards) pays 3:2</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">🏆</span>
                <span>Beat the dealer to win!</span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-6xl px-2">
          <div className="rounded-3xl border border-purple-500/20 bg-black/40 p-4 shadow-[0_0_50px_rgba(168,85,247,0.15)] backdrop-blur-md sm:p-8">
            {/* Room Header */}
            <div className="mb-6 flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-purple-300">
                    Room: <span className="text-white">{roomId}</span>
                  </h2>
                  <button
                    onClick={copyRoomId}
                    className="rounded-lg bg-purple-500/20 p-2 text-purple-300 transition-colors hover:bg-purple-500/40 hover:text-white"
                  >
                    {copied ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="mt-1 text-sm font-medium text-purple-400/50">
                  {room?.players.length ?? 0}/{room?.maxPlayers ?? 0} Players
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-yellow-500/20 bg-black/40 px-4 py-2">
                  <span className="text-xs font-bold text-yellow-500/70 uppercase">
                    Credits
                  </span>
                  <span className="text-lg font-black text-yellow-400">
                    {credits}
                  </span>
                </div>
                {!room?.gameStarted && (
                  <>
                    <button
                      onClick={handleStartGame}
                      disabled={isLoading || (room?.players.length ?? 0) === 0}
                      className="rounded-xl bg-green-600 px-6 py-2 font-bold tracking-wider text-white uppercase shadow-lg transition-all hover:scale-105 hover:bg-green-500 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      Start Game
                    </button>
                    <button
                      onClick={handleLeaveRoom}
                      className="rounded-xl border border-red-500/20 bg-red-600/20 px-6 py-2 font-bold tracking-wider text-red-400 uppercase transition-all hover:bg-red-600 hover:text-white"
                    >
                      Leave
                    </button>
                  </>
                )}
                {room?.gameEnded && nextRoundCountdown !== null && (
                  <div className="animate-pulse rounded-xl bg-purple-600 px-6 py-2 text-sm font-bold tracking-wider text-white uppercase">
                    Next round in {nextRoundCountdown}s
                  </div>
                )}
              </div>
            </div>

            {/* Bet Adjustment - Before Game Starts */}
            {currentPlayer && !room?.gameStarted && (
              <div className="mb-8 hidden rounded-2xl border border-yellow-500/30 bg-yellow-900/10 p-6 sm:block">
                <div className="mb-6 text-center">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="animate-pulse text-3xl">💰</span>
                      <h3 className="text-2xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">
                        {localBet} Credits
                      </h3>
                    </div>
                    {localBet !== currentPlayer.bet && (
                      <span className="animate-bounce rounded-full bg-red-500 px-3 py-1 text-xs font-bold tracking-wider text-white uppercase shadow-lg">
                        Not Confirmed
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-medium text-yellow-200/50">
                    Available: {credits} Credits
                  </p>
                  {currentPlayer.bet !== localBet && (
                    <p className="mt-1 text-xs font-bold text-yellow-500">
                      Current confirmed bet: {currentPlayer.bet}
                    </p>
                  )}
                </div>
                <div className="space-y-6">
                  <input
                    type="range"
                    min="10"
                    max={credits}
                    step="10"
                    value={localBet}
                    onChange={(e) => setLocalBet(parseInt(e.target.value))}
                    className="h-3 w-full cursor-pointer appearance-none rounded-full bg-yellow-900/30 accent-yellow-400 hover:accent-yellow-300"
                  />
                  <div className="flex justify-between text-xs font-bold tracking-wider text-yellow-500/50 uppercase">
                    <span>10 Min</span>
                    <span>{credits} Max</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        const half = Math.max(
                          10,
                          Math.floor(localBet / 2 / 10) * 10,
                        );
                        setLocalBet(half);
                      }}
                      className="rounded-xl border border-yellow-500/20 bg-yellow-600/20 px-4 py-3 text-sm font-bold tracking-wider text-yellow-400 uppercase transition-all hover:bg-yellow-600 hover:text-white"
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
                      className="rounded-xl border border-yellow-500/20 bg-yellow-600/20 px-4 py-3 text-sm font-bold tracking-wider text-yellow-400 uppercase transition-all hover:bg-yellow-600 hover:text-white"
                    >
                      2x
                    </button>
                  </div>
                  {localBet !== currentPlayer.bet && (
                    <button
                      onClick={handleConfirmBet}
                      disabled={isLoading}
                      className="w-full rounded-xl bg-green-600 px-6 py-4 font-black tracking-wider text-white uppercase shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all hover:scale-105 hover:bg-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] disabled:opacity-50"
                    >
                      {isLoading ? "Confirming..." : "Confirm Bet"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Dealer's Hand */}
            {room?.gameStarted && (
              <div className="mb-8 rounded-2xl border border-yellow-500/30 bg-black/60 p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between gap-3 text-xl font-bold text-yellow-400">
                  <div className="flex items-center gap-3 tracking-wider uppercase">
                    Dealer
                  </div>
                  {room.gameEnded && (
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-black ${room.dealer.busted ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"}`}
                    >
                      {room.dealer.busted
                        ? "BUSTED"
                        : calculateHandValue(room.dealer.hand)}
                    </span>
                  )}
                </div>
                <div className="flex min-h-[140px] w-full items-center justify-center gap-4 overflow-auto px-2 py-4">
                  {room.dealer.hand.map((card, idx) => (
                    <AnimatedCard
                      key={`${card.display}-${idx}`}
                      card={card}
                      faceDown={!room.gameEnded && idx === 1}
                      reveal={room.gameEnded && idx === 1}
                      className="shadow-2xl"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Players */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                    className={`relative flex min-h-[200px] w-full flex-col justify-between rounded-2xl border-2 p-4 transition-all duration-300 ${
                      isCurrentPlayer
                        ? "border-cyan-400 bg-cyan-900/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                        : isTurn
                          ? "z-10 scale-105 border-yellow-400 bg-yellow-900/20 shadow-[0_0_20px_rgba(250,204,21,0.1)]"
                          : "border-purple-500/30 bg-purple-900/10"
                    } ${isWinner && winAmount > 0 ? "animate-pulse border-green-400 ring-4 ring-green-400/50" : ""}`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="truncate text-lg font-bold text-white">
                          {player.name}
                          {isCurrentPlayer && (
                            <span className="ml-2 text-sm text-cyan-400">
                              (You)
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-medium text-purple-300/70">
                          {player.credits} Credits
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isTurn && (
                          <div className="absolute -top-3 right-4 rounded-full bg-yellow-400 px-3 py-1 text-xs font-black tracking-wider text-black uppercase shadow-lg">
                            YOUR TURN
                          </div>
                        )}
                        {isWinner && winAmount > 0 && (
                          <div className="flex flex-col items-end gap-0.5">
                            <div className="flex items-center gap-1 text-xs font-black tracking-wider text-yellow-300 uppercase">
                              <span className="animate-gentleSparkle">
                                {player.blackjack ? "🌟" : "✨"}
                              </span>
                              {player.blackjack ? "BLACKJACK!" : "WIN"}
                            </div>
                            <div className="text-sm font-bold text-green-400">
                              +{winAmount}
                            </div>
                          </div>
                        )}
                        {room.gameEnded &&
                          handValue === calculateHandValue(room.dealer.hand) &&
                          !player.busted &&
                          player.bet > 0 && (
                            <div className="rounded-lg bg-blue-900/30 px-2 py-1 text-xs font-black tracking-wider text-blue-400 uppercase">
                              PUSH
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="mb-4 flex items-center justify-between text-sm font-medium">
                      <span className="text-purple-300/70">
                        Bet: <span className="text-white">{player.bet}</span>
                      </span>
                      {room.gameStarted ? (
                        player.busted ? (
                          <span className="font-bold text-red-400 uppercase">
                            BUSTED
                          </span>
                        ) : player.blackjack ? (
                          <span className="font-bold text-yellow-400 uppercase">
                            BLACKJACK!
                          </span>
                        ) : player.stand ? (
                          <span className="font-bold text-blue-400 uppercase">
                            STAND ({handValue})
                          </span>
                        ) : (
                          <span className="font-bold text-green-400 uppercase">
                            Value: {handValue}
                          </span>
                        )
                      ) : (
                        <span className="text-purple-400/50 italic">
                          Waiting...
                        </span>
                      )}
                    </div>

                    {player.hand.length > 0 && (
                      <div className="flex min-h-20 flex-wrap items-center justify-center gap-2">
                        {player.hand.map((card, cardIdx) => (
                          <AnimatedCard
                            key={`${player.id}-${card.display}-${cardIdx}`}
                            card={card}
                            className="h-16 w-12 rounded-lg border-2 border-gray-300 bg-white shadow-lg sm:h-20 sm:w-14 md:h-24 md:w-16"
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
                <div className="fixed bottom-8 left-1/2 z-50 mt-6 flex w-[calc(100%-32px)] max-w-md -translate-x-1/2 items-center justify-center gap-4 rounded-2xl border border-white/10 bg-black/80 p-4 shadow-2xl backdrop-blur-xl sm:static sm:bottom-auto sm:left-auto sm:w-auto sm:max-w-none sm:translate-x-0 sm:border-none sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none">
                  <button
                    onClick={handleHit}
                    disabled={isLoading}
                    className="flex-1 rounded-xl bg-green-600 px-8 py-4 text-xl font-black tracking-wider text-white uppercase shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all hover:scale-105 hover:bg-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] disabled:opacity-50 sm:flex-none"
                  >
                    Hit
                  </button>
                  <button
                    onClick={handleStand}
                    disabled={isLoading}
                    className="flex-1 rounded-xl bg-red-600 px-8 py-4 text-xl font-black tracking-wider text-white uppercase shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all hover:scale-105 hover:bg-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] disabled:opacity-50 sm:flex-none"
                  >
                    Stand
                  </button>
                </div>
              )}

            {message && (
              <div
                className={`animate-fade-in mt-6 rounded-xl border p-4 text-center font-bold backdrop-blur-md ${
                  message.type === "success"
                    ? "border-green-500/30 bg-green-900/30 text-green-300"
                    : message.type === "error"
                      ? "border-red-500/30 bg-red-900/30 text-red-300"
                      : "border-blue-500/30 bg-blue-900/30 text-blue-300"
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
