"use client";

import { useState, useEffect, useCallback } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import {
  Cherry,
  Diamond,
  Sword,
  Heart,
  Rat,
  Angry,
  Banana,
  Info,
  Zap,
  Star,
} from "lucide-react";
import { spin } from "./actions";
import Link from "next/link";

const iconMap: Record<string, React.ElementType> = {
  cherry: Cherry,
  diamonds: Diamond,
  sword: Sword,
  heart: Heart,
  mouse: Rat,
  angry: Angry,
  banana: Banana,
  "2x": Zap,
  star: Star,
  seven: () => (
    <span className="text-2xl font-bold text-purple-500 sm:text-3xl">7</span>
  ),
};

interface SlotMachineProps {
  initialCredits: number;
}

// Weighted randomness for client-side animation only
const weightedItems: string[] = [
  ...Array<string>(30).fill("cherry"), // Increased
  ...Array<string>(60).fill("mouse"), // Increased
  ...Array<string>(80).fill("heart"), // Increased
  ...Array<string>(10).fill("sword"), // Same
  ...Array<string>(5).fill("diamonds"), // Rare
  ...Array<string>(30).fill("angry"), // Very Common
  ...Array<string>(40).fill("banana"), // Increased
  ...Array<string>(20).fill("star"), // Rare
  ...Array<string>(10).fill("seven"), // Very Rare
  ...Array<string>(1).fill("2x"), // Very Rare
];

function getRandomItem() {
  return weightedItems[Math.floor(Math.random() * weightedItems.length)]!;
}

export default function SlotMachine({ initialCredits }: SlotMachineProps) {
  const { width, height } = useWindowSize();
  const [credits, setCredits] = useState(initialCredits);
  const [spinning, setSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [winMessage, setWinMessage] = useState<{
    text: string;
    icon?: string;
  } | null>(null);
  const [winningIndices, setWinningIndices] = useState<number[][][]>([]);
  const [lastWinAmount, setLastWinAmount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  // Slot is a single player game - notifications are local-only
  const [showBigWin, setShowBigWin] = useState(false);
  const [autoSpinning, setAutoSpinning] = useState(false);
  const [lastBigWinTime, setLastBigWinTime] = useState<number | null>(null);

  const initialRow = [
    getRandomItem(),
    getRandomItem(),
    getRandomItem(),
    getRandomItem(),
    getRandomItem(),
  ];
  const [matrix, setMatrix] = useState([initialRow, initialRow, initialRow]);

  const handleSpin = useCallback(async () => {
    if (spinning) return;

    setSpinning(true);
    setWinMessage(null);
    setWinningIndices([]);
    setShowConfetti(false);
    setShowBigWin(false);

    // Start animation immediately
    const animationDuration = 2000; // 2 seconds
    const intervalTime = 100;
    const steps = animationDuration / intervalTime;

    let currentStep = 0;

    // Call server action
    const result = await spin(betAmount);

    if ("error" in result) {
      setSpinning(false);
      alert(result.error);
      return;
    }

    const animationInterval = setInterval(() => {
      setMatrix((prevMatrix) => {
        const newRow = [
          getRandomItem(),
          getRandomItem(),
          getRandomItem(),
          getRandomItem(),
          getRandomItem(),
        ];
        return [newRow, ...prevMatrix.slice(0, -1)];
      });

      currentStep++;

      if (currentStep >= steps) {
        clearInterval(animationInterval);
        // Set final result from server
        setMatrix(result.matrix);
        setCredits(result.newCredits);

        if (result.message) {
          setWinMessage({ text: result.message, icon: result.iconKey });
        }

        if (result.winningIndices) {
          setWinningIndices(result.winningIndices);
        }

        if (result.winAmount > 0) {
          setLastWinAmount(result.winAmount);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);

          if (result.winAmount >= betAmount * 5) {
            setShowBigWin(true);
            setLastBigWinTime(Date.now());
            setTimeout(() => setShowBigWin(false), 4000);
          }
        }

        setSpinning(false);
      }
    }, intervalTime);
  }, [spinning, betAmount]);

  useEffect(() => {
    if (autoSpinning && !spinning) {
      if (credits < betAmount) {
        setAutoSpinning(false);
        return;
      }

      // Check if we need to wait after a big win
      const bigWinDelay =
        lastBigWinTime && Date.now() - lastBigWinTime < 3000 ? 3000 : 500;

      const timer = setTimeout(() => {
        void handleSpin();
      }, bigWinDelay);
      return () => clearTimeout(timer);
    }
  }, [autoSpinning, spinning, credits, betAmount, handleSpin, lastBigWinTime]);

  // Slot is single-player; no global notifications used

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-linear-to-b from-[#1a0b2e] to-[#0f0f1a] p-2 font-sans text-white sm:p-4">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {showBigWin && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm duration-300">
          <div className="flex animate-bounce flex-col items-center">
            <h1 className="text-6xl font-black tracking-tighter text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.8)] md:text-9xl">
              BIG WIN!
            </h1>
            <div className="mt-4 text-4xl font-bold text-white drop-shadow-lg md:text-6xl">
              +{lastWinAmount} Coins
            </div>
          </div>
        </div>
      )}

      {/* No global notification block for slot - single-player only */}

      <div className="group absolute top-2 right-2 z-50 sm:top-4 sm:right-4">
        <button className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20">
          <Info className="h-6 w-6 text-purple-300" />
        </button>
        <div className="pointer-events-none absolute top-full right-0 mt-2 w-64 rounded-xl border border-purple-500/30 bg-black/90 p-4 text-left text-sm opacity-0 shadow-xl backdrop-blur-xl transition-opacity group-hover:opacity-100">
          <h3 className="mb-2 font-bold text-purple-300">
            Paytable (Base Bet 10)
          </h3>
          <div className="space-y-1 text-gray-300">
            <div className="flex justify-between">
              <span>7️⃣ Seven</span>
              <span>150</span>
            </div>
            <div className="flex justify-between">
              <span>💎 Diamond</span>
              <span>100</span>
            </div>
            <div className="flex justify-between">
              <span>⭐ Star</span>
              <span>75</span>
            </div>
            <div className="flex justify-between">
              <span>⚔️ Sword</span>
              <span>50</span>
            </div>
            <div className="flex justify-between">
              <span>❤️ Heart</span>
              <span>30</span>
            </div>
            <div className="flex justify-between">
              <span>🐭 Mouse</span>
              <span>20</span>
            </div>
            <div className="flex justify-between">
              <span>🍌 Banana</span>
              <span>15</span>
            </div>
            <div className="flex justify-between">
              <span>🍒 Cherry</span>
              <span>10</span>
            </div>
            <div className="flex justify-between">
              <span>😠 Angry</span>
              <span>5</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-yellow-500/30 pt-2 font-bold text-yellow-400">
              <span>⚡ 2x Multiplier</span>
              <span>x2 Win!</span>
            </div>
          </div>
          <div className="mt-3 border-t border-white/10 pt-3">
            <h4 className="mb-1 font-bold text-purple-300">Multipliers</h4>
            <div className="flex justify-between text-xs text-gray-400">
              <span>3x Match</span>
              <span>50%</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>4x Match</span>
              <span>75%</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>5x Match</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 flex w-full max-w-6xl items-center justify-between sm:mb-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-sm font-bold text-purple-300 backdrop-blur-md transition hover:bg-black/60 hover:text-white sm:px-6 sm:py-3 sm:text-base"
        >
          ← Back
        </Link>
        <h1 className="bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-2xl font-black tracking-tighter text-transparent drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] sm:text-4xl md:text-5xl">
          Slotovski
        </h1>
        <div className="w-20 sm:w-[100px]"></div> {/* Spacer */}
      </div>

      <div className="flex w-full max-w-fit flex-col items-center gap-4 px-2 sm:gap-8 lg:flex-row lg:items-start">
        <div className="relative w-full rounded-2xl border-2 border-purple-900 bg-black/80 p-2 shadow-2xl shadow-purple-900/50 sm:rounded-3xl sm:border-4 sm:p-4 md:border-8 md:p-8">
          {/* Machine Frame */}
          <div className="relative overflow-hidden rounded-lg border-2 border-yellow-600/50 bg-linear-to-b from-gray-900 to-black p-1 sm:rounded-xl sm:border-4 sm:p-2 md:p-4">
            {/* Payline Indicator */}
            <div className="pointer-events-none absolute top-1/2 left-0 z-10 h-16 w-full md:h-24"></div>

            <div className="flex flex-col gap-1 sm:gap-2 md:gap-4">
              {matrix.map((row, rowIndex) => (
                <div
                  className={`flex flex-row justify-center gap-1 transition-all duration-100 sm:gap-2 md:gap-4`}
                  key={rowIndex}
                >
                  {row.map((itemKey, colIndex) => {
                    const Icon = iconMap[itemKey];
                    const isWinning = winningIndices.some((segment) =>
                      segment.some(
                        ([r, c]) => r === rowIndex && c === colIndex,
                      ),
                    );

                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`flex aspect-square h-12 w-12 items-center justify-center rounded-lg border bg-linear-to-br shadow-inner backdrop-blur-sm transition-all duration-300 sm:h-16 sm:w-16 md:h-24 md:w-24 ${
                          isWinning
                            ? "z-10 scale-110 border-yellow-400 from-yellow-900/50 to-purple-900/50 shadow-[0_0_20px_rgba(250,204,21,0.5)]"
                            : "border-white/10 from-purple-800/50 to-blue-900/50"
                        }`}
                      >
                        {Icon ? (
                          <Icon
                            className={`h-6 w-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] sm:h-10 sm:w-10 md:h-12 md:w-12 ${
                              isWinning
                                ? "animate-pulse drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]"
                                : ""
                            } ${itemKey === "diamonds" ? "text-cyan-300" : itemKey === "heart" ? "text-red-400" : itemKey === "cherry" ? "text-red-500" : itemKey === "banana" ? "text-yellow-400" : "text-white"}`}
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex flex-col items-center gap-4 sm:mt-8 sm:gap-6">
            <div className="min-h-8 text-center text-base font-bold text-yellow-400 drop-shadow-md sm:text-xl md:min-h-12 md:text-2xl">
              {winMessage && (
                <div className="flex animate-bounce items-center gap-2">
                  {(() => {
                    if (winMessage.icon && iconMap[winMessage.icon]) {
                      const WinIcon = iconMap[winMessage.icon];
                      return WinIcon ? (
                        <WinIcon className="h-6 w-6 md:h-8 md:w-8" />
                      ) : null;
                    }
                    return null;
                  })()}
                  <span>{winMessage.text}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <button
                onClick={handleSpin}
                disabled={spinning || autoSpinning}
                className={`group relative rounded-2xl px-8 py-3 text-base font-black tracking-wider uppercase transition-all duration-200 sm:px-10 sm:py-4 sm:text-xl md:px-16 md:py-5 md:text-2xl ${
                  spinning || autoSpinning
                    ? "cursor-not-allowed border border-gray-700 bg-gray-800 text-gray-600"
                    : "border border-purple-400/30 bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:scale-105 hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] active:scale-95"
                } `}
              >
                {spinning ? "Spinning..." : `SPIN (${betAmount})`}
              </button>

              <button
                onClick={() => setAutoSpinning(!autoSpinning)}
                disabled={spinning && !autoSpinning}
                className={`rounded-xl px-6 py-2 text-sm font-bold uppercase transition-all duration-200 sm:px-8 sm:py-3 sm:text-base ${
                  autoSpinning
                    ? "border border-red-500/50 bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    : "border border-purple-500/30 bg-purple-900/30 text-purple-300 hover:bg-purple-900/50 hover:text-white"
                }`}
              >
                {autoSpinning ? "Stop Auto" : "Auto Spin"}
              </button>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="flex w-full flex-col gap-6 rounded-3xl border border-purple-500/20 bg-black/40 p-6 shadow-xl backdrop-blur-md lg:w-80">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-sm font-bold tracking-widest text-purple-400 uppercase">
              Credits
            </h2>
            <div className="text-4xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">
              {credits}
            </div>
          </div>

          <div className="h-px w-full bg-linear-to-r from-transparent via-purple-500/30 to-transparent"></div>

          <div className="flex w-full flex-col items-center gap-4">
            <h2 className="text-sm font-bold tracking-widest text-purple-400 uppercase">
              Bet Amount
            </h2>
            <div className="flex w-full flex-col items-center gap-4">
              <div className="flex w-full items-center justify-between gap-2 rounded-xl border border-purple-500/20 bg-black/40 p-2">
                <button
                  onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 text-xl font-bold text-purple-300 transition-colors hover:bg-purple-500/40 hover:text-white disabled:opacity-50"
                  disabled={spinning}
                >
                  -
                </button>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) setBetAmount(val);
                    else setBetAmount(0);
                  }}
                  onBlur={() => setBetAmount(Math.max(10, betAmount))}
                  className="w-24 bg-transparent text-center text-2xl font-bold text-white focus:outline-none"
                  disabled={spinning}
                />
                <button
                  onClick={() => setBetAmount(betAmount + 10)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 text-xl font-bold text-purple-300 transition-colors hover:bg-purple-500/40 hover:text-white disabled:opacity-50"
                  disabled={spinning}
                >
                  +
                </button>
              </div>

              <div className="w-full px-2">
                <input
                  type="range"
                  min="1"
                  max={credits}
                  step={credits >= 10 ? 10 : 1}
                  value={betAmount}
                  onChange={(e) => setBetAmount(parseInt(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-purple-900/50 accent-purple-500 hover:accent-purple-400"
                  disabled={spinning}
                />
                <div className="mt-2 flex w-full justify-between text-xs font-medium text-purple-400/50">
                  <span>Min</span>
                  <span>Max</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
