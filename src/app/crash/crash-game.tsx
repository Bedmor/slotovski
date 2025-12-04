"use client";

import { useState, useEffect, useRef } from "react";
import { startGame, cashOut, finishGame } from "./actions";
import { useRouter } from "next/navigation";

interface StartGameResponse {
  success?: boolean;
  error?: string;
  gameId?: string;
  crashPoint?: number;
  credits?: number;
}

export default function CrashGame() {
  const [betAmount, setBetAmount] = useState(10);
  const [gameState, setGameState] = useState<
    "IDLE" | "STARTING" | "RUNNING" | "CRASHED" | "SUCCESS"
  >("IDLE");
  const [multiplier, setMultiplier] = useState(1.0);
  const [gameId, setGameId] = useState<string | null>(null);
  const [winAmount, setWinAmount] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const crashPointRef = useRef<number>(0);
  const gameIdRef = useRef<string | null>(null);

  const router = useRouter();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const drawGraph = (currentM: number, crashed: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < width; i += 50) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
    }
    for (let i = 0; i < height; i += 50) {
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
    }
    ctx.stroke();

    // Calculate scales
    const k = 0.00015; // Must match runGameLoop
    const currentT = Math.log(currentM) / k;

    // View window: Auto-scale to keep rocket in view
    const maxTime = Math.max(5000, currentT); // Min 5 seconds
    const maxMult = Math.max(2, currentM); // Min 2x

    // Add padding
    const viewWidth = maxTime * 1.1;
    const viewHeight = (maxMult - 1) * 1.1;

    const scaleX = width / viewWidth;
    const scaleY = height / viewHeight;

    // Draw curve
    ctx.lineWidth = 4;
    ctx.strokeStyle = crashed ? "#ef4444" : "#a855f7";

    ctx.beginPath();
    ctx.moveTo(0, height); // Start at bottom-left (t=0, m=1)

    const steps = 100;
    for (let i = 1; i <= steps; i++) {
      const t = (currentT / steps) * i;
      const m = Math.exp(k * t);

      const x = t * scaleX;
      const y = height - (m - 1) * scaleY;

      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw Rocket
    const rocketX = currentT * scaleX;
    const rocketY = height - (currentM - 1) * scaleY;

    if (!crashed) {
      ctx.font = "24px Arial";
      ctx.fillText("🚀", rocketX - 20, rocketY - 10);
    } else {
      ctx.font = "24px Arial";
      ctx.fillText("💥", rocketX - 10, rocketY - 10);
    }

    // Draw axes labels
    ctx.fillStyle = "#888";
    ctx.font = "12px monospace";
    ctx.fillText("1.0x", 5, height - 5);
    ctx.fillText(maxMult.toFixed(2) + "x", 5, 20);
    ctx.fillText((maxTime / 1000).toFixed(1) + "s", width - 40, height - 5);
  };
  const runGameLoop = () => {
    const now = Date.now();
    const elapsed = now - startTimeRef.current;

    const newMultiplier = Math.max(1.0, Math.pow(Math.E, 0.00015 * elapsed));

    setMultiplier(newMultiplier);
    drawGraph(newMultiplier, false);

    if (newMultiplier >= crashPointRef.current) {
      // CRASH
      setMultiplier(crashPointRef.current);
      setGameState("CRASHED");
      drawGraph(crashPointRef.current, true);
      void finishGame(gameIdRef.current!); // Notify server (optional cleanup)
      setHistory((prev) => [crashPointRef.current, ...prev].slice(0, 10));
      router.refresh(); // Update balance
    } else {
      animationRef.current = requestAnimationFrame(runGameLoop);
    }
  };

  const handleStart = async () => {
    if (betAmount <= 0) return;

    setGameState("STARTING");
    setWinAmount(null);

    const result = await startGame(betAmount);

    if (result.error || !result.success) {
      alert(result.error ?? "Failed to start");
      setGameState("IDLE");
      return;
    }

    const res = result as StartGameResponse;

    if (!res.gameId || res.crashPoint === undefined) return;

    setGameId(res.gameId);
    gameIdRef.current = res.gameId;
    crashPointRef.current = res.crashPoint;

    setGameState("RUNNING");
    setMultiplier(1.0);
    startTimeRef.current = Date.now();

    runGameLoop();
  };

  const handleCashOut = async () => {
    if (gameState !== "RUNNING" || !gameId) return;

    // Stop animation immediately visually
    cancelAnimationFrame(animationRef.current);

    const currentM = multiplier;

    // Optimistic update
    setGameState("SUCCESS");
    setWinAmount(Math.floor(betAmount * currentM));

    const result = await cashOut(gameId, currentM);

    if (result.error) {
      // If server says we crashed (latency), we must accept it
      setGameState("CRASHED");
      setMultiplier(crashPointRef.current); // Show actual crash point
      drawGraph(crashPointRef.current, true);
      alert("Too late! Crashed at " + crashPointRef.current + "x");
    } else {
      // Confirmed win
      setHistory((prev) => [currentM, ...prev].slice(0, 10));
      router.refresh();
    }
  };

  return (
    <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start">
      {/* Game Area */}
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-purple-500/20 bg-black/40 shadow-[0_0_50px_rgba(168,85,247,0.15)] backdrop-blur-md lg:flex-2">
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className="h-full w-full object-cover"
        />

        {/* Overlay Stats */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <div
            className={`text-6xl font-black tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-100 sm:text-8xl ${
              gameState === "CRASHED"
                ? "text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]"
                : gameState === "SUCCESS"
                  ? "text-green-400 drop-shadow-[0_0_30px_rgba(74,222,128,0.5)]"
                  : "text-white"
            }`}
          >
            {multiplier.toFixed(2)}x
          </div>

          {gameState === "CRASHED" && (
            <div className="mt-4 animate-bounce text-2xl font-black tracking-widest text-red-500 uppercase drop-shadow-lg sm:text-4xl">
              CRASHED
            </div>
          )}

          {gameState === "SUCCESS" && (
            <div className="mt-4 animate-bounce text-2xl font-black tracking-widest text-green-400 uppercase drop-shadow-lg sm:text-4xl">
              CASHED OUT!
            </div>
          )}
        </div>
      </div>

      {/* Controls & History */}
      <div className="flex w-full flex-col gap-6 lg:flex-1">
        <div className="flex flex-col gap-6 rounded-3xl border border-purple-500/20 bg-black/40 p-6 shadow-xl backdrop-blur-md sm:p-8">
          <div className="space-y-4">
            <label className="text-sm font-bold tracking-widest text-purple-400 uppercase">
              Bet Amount
            </label>
            <div className="relative">
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                disabled={gameState === "RUNNING"}
                className="w-full rounded-xl border border-purple-500/30 bg-black/40 px-4 py-4 text-2xl font-bold text-white transition-all focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 focus:outline-none disabled:opacity-50"
              />
              <span className="absolute top-1/2 right-4 -translate-y-1/2 text-sm font-bold tracking-wider text-purple-400/50 uppercase">
                Credits
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[10, 50, 100, 500].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setBetAmount(amt)}
                  disabled={gameState === "RUNNING"}
                  className="rounded-lg border border-purple-500/20 bg-purple-900/20 py-2 text-xs font-bold text-purple-300 transition-all hover:bg-purple-900/40 hover:text-white disabled:opacity-50"
                >
                  {amt}
                </button>
              ))}
            </div>
          </div>

          {gameState === "RUNNING" ? (
            <button
              onClick={handleCashOut}
              className="w-full rounded-xl bg-green-500 py-6 text-2xl font-black tracking-wider text-black uppercase shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all hover:scale-105 hover:bg-green-400 hover:shadow-[0_0_50px_rgba(34,197,94,0.6)] active:scale-95"
            >
              CASH OUT
            </button>
          ) : (
            <button
              onClick={handleStart}
              disabled={gameState === "STARTING"}
              className="w-full rounded-xl bg-linear-to-r from-purple-600 to-pink-600 py-6 text-2xl font-black tracking-wider text-white uppercase shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {gameState === "STARTING" ? "Starting..." : "BET"}
            </button>
          )}

          {winAmount !== null && (
            <div className="animate-fade-in rounded-xl border border-green-500/30 bg-green-900/20 p-4 text-center">
              <div className="text-xs font-bold tracking-wider text-green-400/70 uppercase">
                You Won
              </div>
              <div className="text-3xl font-black text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]">
                +{winAmount}
              </div>
            </div>
          )}
        </div>

        {/* History */}
        <div className="rounded-3xl border border-purple-500/20 bg-black/40 p-4 backdrop-blur-md">
          <div className="mb-3 text-xs font-bold tracking-wider text-purple-400/50 uppercase">
            Recent Crashes
          </div>
          <div className="flex flex-wrap gap-2">
            {history.length === 0 && (
              <span className="text-sm text-purple-400/30 italic">
                No history yet
              </span>
            )}
            {history.map((h, i) => (
              <div
                key={i}
                className={`rounded-lg px-3 py-1.5 font-mono text-sm font-bold shadow-sm ${
                  h >= 2.0
                    ? "border border-green-500/20 bg-green-500/20 text-green-400"
                    : "border border-red-500/20 bg-red-500/20 text-red-400"
                }`}
              >
                {h.toFixed(2)}x
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
