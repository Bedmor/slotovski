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

  const getMineMultiplierInfo = (mines: number) => {
    const baseIncrease = 0.1 + mines / 100;
    return baseIncrease.toFixed(3);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-linear-to-b from-[#1a0b2e] to-[#0f0f1a] p-2 pt-16 font-sans text-white sm:p-4 sm:pt-20">
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
        className="absolute top-2 left-2 flex items-center gap-2 rounded-lg bg-purple-800/50 px-3 py-2 text-sm transition-colors hover:bg-purple-700 sm:top-4 sm:left-4 sm:px-4"
      >
        🏠 Home
      </Link>

      <div className="mb-4 text-center sm:mb-8">
        <h1 className="bg-linear-to-r from-purple-400 to-pink-600 bg-clip-text text-3xl font-extrabold tracking-tighter text-transparent drop-shadow-lg sm:text-4xl md:text-6xl">
          DIAMOND MINES
        </h1>
        <p className="mt-1 text-base text-purple-300 sm:mt-2 sm:text-lg">
          Find diamonds, avoid mines!
        </p>
      </div>

      <div className="flex w-full max-w-6xl flex-col items-center gap-4 px-2 lg:flex-row lg:items-start lg:gap-8">
        {/* Game Board */}
        <div className="relative w-full max-w-2xl rounded-2xl border-2 border-purple-900 bg-black/80 p-4 shadow-2xl shadow-purple-900/50 sm:border-4 sm:p-6 md:p-8">
          {!gameState ? (
            <div className="flex flex-col items-center gap-6">
              <div className="text-center">
                <h2 className="mb-2 text-2xl font-bold text-purple-300">
                  Start New Game
                </h2>
                <p className="text-sm text-gray-400">
                  Configure your bet and mine count
                </p>
              </div>

              <div className="flex w-full max-w-md flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-lg font-bold text-purple-300">
                    Bet Amount: {betAmount}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max={credits}
                    step="10"
                    value={betAmount}
                    onChange={(e) => setBetAmount(parseInt(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-purple-900 accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>10</span>
                    <span>{credits}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-lg font-bold text-purple-300">
                    Mines: {mineCount}
                    <span className="ml-2 text-sm text-yellow-400">
                      (+{getMineMultiplierInfo(mineCount)} per diamond)
                    </span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={mineCount}
                    onChange={(e) => setMineCount(parseInt(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-purple-900 accent-red-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>1 (Easy)</span>
                    <span>20 (Hard)</span>
                  </div>
                </div>

                <button
                  onClick={handleStartGame}
                  disabled={isStarting || credits < betAmount}
                  className="rounded-full bg-linear-to-r from-pink-600 to-purple-600 px-8 py-4 text-xl font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isStarting ? "Starting..." : `Start Game (${betAmount})`}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Game Info */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-purple-900/30 p-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400">Multiplier</span>
                  <span className="text-2xl font-bold text-yellow-400">
                    {gameState.currentMultiplier.toFixed(2)}x
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400">Diamonds Found</span>
                  <span className="text-2xl font-bold text-cyan-400">
                    {gameState.diamondsFound}/
                    {36 -
                      gameState.grid.flat().filter((t) => t === "mine").length}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400">Potential Win</span>
                  <span className="text-2xl font-bold text-green-400">
                    {Math.round(betAmount * gameState.currentMultiplier)}
                  </span>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-6 gap-1 sm:gap-2">
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
                        className={`aspect-square w-full rounded-lg border-2 transition-all duration-200 ${
                          isRevealed
                            ? isMine
                              ? "border-red-500 bg-red-900/50"
                              : "border-cyan-400 bg-cyan-900/50"
                            : "border-purple-600 bg-purple-800/50 hover:scale-105 hover:border-purple-400 active:scale-95 disabled:cursor-not-allowed"
                        }`}
                      >
                        {isRevealed ? (
                          isMine ? (
                            <Bomb className="mx-auto h-6 w-6 text-red-400 sm:h-8 sm:w-8" />
                          ) : (
                            <Diamond className="mx-auto h-6 w-6 text-cyan-400 sm:h-8 sm:w-8" />
                          )
                        ) : (
                          <div className="text-2xl">?</div>
                        )}
                      </button>
                    );
                  }),
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={handleCashOut}
                  disabled={
                    gameState.isGameOver ||
                    gameState.diamondsFound === 0 ||
                    isRevealing
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 font-bold uppercase transition-all hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trophy className="h-5 w-5" />
                  Cash Out (
                  {Math.round(betAmount * gameState.currentMultiplier)})
                </button>
                <button
                  onClick={() => {
                    setGameState(null);
                    setMessage(null);
                  }}
                  className="rounded-full bg-purple-800 px-6 py-3 font-bold uppercase transition-all hover:bg-purple-700"
                >
                  New Game
                </button>
              </div>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div
              className={`mt-4 rounded-lg p-4 text-center font-bold ${
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

        {/* Side Panel */}
        <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl border-2 border-purple-900 bg-black/80 p-4 shadow-xl sm:border-4 sm:p-6 lg:w-auto">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-xl font-bold text-purple-300">Credits</h2>
            <div className="text-3xl font-bold text-yellow-400">{credits}</div>
          </div>

          <div className="h-px w-full bg-purple-800/50"></div>

          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-purple-300">How to Play</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💎</span>
                <span>
                  Click tiles to reveal diamonds and increase your multiplier
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">💣</span>
                <span>Avoid mines! Hitting one ends the game</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">⚡</span>
                <span>More mines = higher multiplier per diamond</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">💰</span>
                <span>Cash out anytime to secure your winnings</span>
              </li>
            </ul>
          </div>

          <div className="h-px w-full bg-purple-800/50"></div>

          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold text-purple-300">
              Multiplier Info
            </h3>
            <div className="space-y-1 text-xs text-gray-400">
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
