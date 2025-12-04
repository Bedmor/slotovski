"use client";

import { useState } from "react";
import { Diamond, Bomb, Trophy } from "lucide-react";
import { startGame, revealTile, cashOut, type GameState } from "./actions";
import Link from "next/link";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface MinesweeperGameProps {
  initialCredits: number;
}

export default function MinesweeperGame({
  initialCredits,
}: MinesweeperGameProps) {
  const { width, height } = useWindowSize();
  const [credits, setCredits] = useState(initialCredits);
  const [betAmount, setBetAmount] = useState(10);
  const [mineCount, setMineCount] = useState(5);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const handleStartGame = async () => {
    setIsStarting(true);
    setMessage(null);

    const result = await startGame(betAmount, mineCount);

    if ("error" in result) {
      setMessage({ text: result.error ?? "An error occurred", type: "error" });
      setIsStarting(false);
      return;
    }

    setGameState(result.gameState);
    setCredits(result.newCredits);
    setIsStarting(false);
  };

  const handleRevealTile = async (row: number, col: number) => {
    if (!gameState || isRevealing || gameState.isGameOver) return;

    setIsRevealing(true);
    setMessage(null);

    const result = await revealTile(gameState, row, col);

    if ("error" in result) {
      setMessage({ text: result.error ?? "An error occurred", type: "error" });
      setIsRevealing(false);
      return;
    }

    setGameState(result.gameState);

    if (result.hitMine) {
      setMessage({
        text: `💥 BOOM! You hit a mine and lost ${betAmount} credits!`,
        type: "error",
      });
      setCredits(result.newCredits!);
    } else {
      const totalDiamonds =
        36 - result.gameState.grid.flat().filter((t) => t === "mine").length;

      if (result.gameState.isGameOver) {
        // Found all diamonds - auto cash out
        const winAmount = Math.round(
          result.gameState.betAmount * result.gameState.currentMultiplier,
        );
        const newCredits = credits + winAmount;
        setCredits(newCredits);
        setMessage({
          text: `🎉 PERFECT! Found all diamonds! Won ${winAmount} credits! (${result.gameState.currentMultiplier.toFixed(2)}x)`,
          type: "success",
        });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      } else {
        setMessage({
          text: `💎 Diamond found! Multiplier: ${result.gameState.currentMultiplier.toFixed(2)}x (${result.gameState.diamondsFound}/${totalDiamonds})`,
          type: "success",
        });
      }
    }

    setIsRevealing(false);
  };

  const handleCashOut = async () => {
    if (!gameState || gameState.isGameOver) return;

    const result = await cashOut(gameState);

    if ("error" in result) {
      setMessage({ text: result.error ?? "An error occurred", type: "error" });
      return;
    }

    setGameState(result.gameState);
    setCredits(result.newCredits);
    setMessage({
      text: `💰 Cashed out ${result.winAmount} credits! (${gameState.currentMultiplier.toFixed(2)}x multiplier)`,
      type: "success",
    });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

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
        <h1 className="bg-linear-to-r from-cyan-400 to-blue-600 bg-clip-text text-2xl font-black tracking-tighter text-transparent drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] sm:text-4xl md:text-5xl">
          DIAMOND MINES
        </h1>
        <div className="w-20 sm:w-[100px]"></div> {/* Spacer */}
      </div>

      <div className="flex w-full max-w-6xl flex-col items-start gap-8 lg:flex-row lg:items-start">
        {/* Game Container */}
        <div className="relative flex w-full flex-col rounded-3xl border border-cyan-500/20 bg-black/40 p-4 shadow-[0_0_50px_rgba(34,211,238,0.15)] backdrop-blur-md sm:rounded-[3rem] sm:border-2 sm:p-8 lg:flex-1">
          {!gameState ? (
            <div className="flex flex-col items-center gap-8 py-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Place Your Bet
                </h2>
                <p className="text-cyan-200/70">
                  Select mines and bet amount to start
                </p>
              </div>

              <div className="flex w-full max-w-md flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold tracking-widest text-cyan-400 uppercase">
                    Bet Amount
                  </label>
                  <div className="flex items-center gap-4 rounded-xl border border-cyan-500/20 bg-black/40 p-2">
                    <button
                      onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20 text-xl font-bold text-cyan-300 transition-colors hover:bg-cyan-500/40 hover:text-white"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(Number(e.target.value))}
                      className="w-full bg-transparent text-center text-2xl font-bold text-white focus:outline-none"
                    />
                    <button
                      onClick={() => setBetAmount(betAmount + 10)}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20 text-xl font-bold text-cyan-300 transition-colors hover:bg-cyan-500/40 hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold tracking-widest text-cyan-400 uppercase">
                    Mines
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="24"
                      value={mineCount}
                      onChange={(e) => setMineCount(Number(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-cyan-900/50 accent-cyan-400 hover:accent-cyan-300"
                    />
                    <span className="min-w-[3ch] text-2xl font-bold text-cyan-400">
                      {mineCount}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-medium text-cyan-400/50">
                    <span>1 (Easy)</span>
                    <span>24 (Hard)</span>
                  </div>
                </div>

                <button
                  onClick={handleStartGame}
                  disabled={isStarting || credits < betAmount}
                  className="rounded-2xl border border-cyan-400/30 bg-linear-to-r from-cyan-600 to-blue-600 px-8 py-4 text-xl font-black tracking-wider text-white uppercase shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(34,211,238,0.6)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isStarting ? "Starting..." : `Start Game (${betAmount})`}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Game Info */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-cyan-500/20 bg-black/40 p-4 backdrop-blur-md">
                <div className="flex flex-col">
                  <span className="text-xs font-bold tracking-wider text-cyan-400/70 uppercase">
                    Multiplier
                  </span>
                  <span className="text-2xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">
                    {gameState.currentMultiplier.toFixed(2)}x
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold tracking-wider text-cyan-400/70 uppercase">
                    Diamonds
                  </span>
                  <span className="text-2xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                    {gameState.diamondsFound}/
                    {36 -
                      gameState.grid.flat().filter((t) => t === "mine").length}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold tracking-wider text-cyan-400/70 uppercase">
                    Potential Win
                  </span>
                  <span className="text-2xl font-black text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]">
                    {Math.round(betAmount * gameState.currentMultiplier)}
                  </span>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-6 gap-2 sm:gap-3">
                {gameState.grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const isRevealed = gameState.revealed[rowIndex]?.[colIndex];
                    const isMine = cell === "mine";

                    return (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleRevealTile(rowIndex, colIndex)}
                        disabled={
                          (isRevealed ?? false) ||
                          isRevealing ||
                          gameState.isGameOver
                        }
                        className={`aspect-square w-full rounded-xl border-2 shadow-lg transition-all duration-300 ${
                          isRevealed
                            ? isMine
                              ? "scale-95 border-red-500 bg-red-900/80 shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                              : "scale-95 border-cyan-400 bg-cyan-900/80 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                            : "border-cyan-500/30 bg-cyan-900/20 hover:scale-105 hover:border-cyan-400 hover:bg-cyan-800/40 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100"
                        }`}
                      >
                        {isRevealed ? (
                          isMine ? (
                            <Bomb className="mx-auto h-6 w-6 animate-bounce text-red-400 sm:h-8 sm:w-8" />
                          ) : (
                            <Diamond className="mx-auto h-6 w-6 animate-pulse text-cyan-400 sm:h-8 sm:w-8" />
                          )
                        ) : (
                          <div className="text-xl font-bold text-cyan-500/30">
                            ?
                          </div>
                        )}
                      </button>
                    );
                  }),
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleCashOut}
                  disabled={
                    gameState.isGameOver ||
                    gameState.diamondsFound === 0 ||
                    isRevealing
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 font-black text-white uppercase shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all hover:scale-105 hover:bg-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Trophy className="h-6 w-6" />
                  Cash Out (
                  {Math.round(betAmount * gameState.currentMultiplier)})
                </button>
                <button
                  onClick={() => {
                    setGameState(null);
                    setMessage(null);
                  }}
                  className="rounded-xl border border-cyan-500/30 bg-cyan-900/30 px-6 py-4 font-bold text-cyan-300 uppercase transition-all hover:border-cyan-400/50 hover:bg-cyan-900/50 hover:text-white"
                >
                  New Game
                </button>
              </div>
            </div>
          )}

          {/* Message Display */}
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

        {/* Side Panel */}
        <div className="flex w-full max-w-md flex-col gap-6 rounded-3xl border border-cyan-500/20 bg-black/40 p-6 shadow-xl backdrop-blur-md lg:w-80">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-sm font-bold tracking-widest text-cyan-400 uppercase">
              Credits
            </h2>
            <div className="text-4xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">
              {credits}
            </div>
          </div>

          <div className="h-px w-full bg-linear-to-r from-transparent via-cyan-500/30 to-transparent"></div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold tracking-widest text-cyan-400 uppercase">
              How to Play
            </h3>
            <ul className="space-y-3 text-sm text-cyan-100/70">
              <li className="flex items-start gap-3">
                <span className="text-xl">💎</span>
                <span>
                  Click tiles to reveal diamonds and increase your multiplier
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">💣</span>
                <span>Avoid mines! Hitting one ends the game</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">⚡</span>
                <span>More mines = higher multiplier per diamond</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">💰</span>
                <span>Cash out anytime to secure your winnings</span>
              </li>
            </ul>
          </div>

          <div className="h-px w-full bg-linear-to-r from-transparent via-cyan-500/30 to-transparent"></div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold tracking-widest text-cyan-400 uppercase">
              Multiplier Info
            </h3>
            <div className="space-y-2 text-xs font-medium text-cyan-200/50">
              <div className="flex justify-between">
                <span>1 Mine:</span>
                <span className="text-yellow-400">+0.11x per diamond</span>
              </div>
              <div className="flex justify-between">
                <span>5 Mines:</span>
                <span className="text-yellow-400">+0.15x per diamond</span>
              </div>
              <div className="flex justify-between">
                <span>10 Mines:</span>
                <span className="text-yellow-400">+0.20x per diamond</span>
              </div>
              <div className="flex justify-between">
                <span>20 Mines:</span>
                <span className="text-yellow-400">+0.30x per diamond</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
