"use client";

import { useState } from "react";
import {
  Cherry,
  Diamond,
  Sword,
  Heart,
  Rat,
  Angry,
  Banana,
  Info,
} from "lucide-react";
import { spin } from "./actions";

const iconMap: Record<string, React.ElementType> = {
  cherry: Cherry,
  diamonds: Diamond,
  sword: Sword,
  heart: Heart,
  mouse: Rat,
  angry: Angry,
  banana: Banana,
};

interface SlotMachineProps {
  initialCredits: number;
}

export default function SlotMachine({ initialCredits }: SlotMachineProps) {
  const [credits, setCredits] = useState(initialCredits);
  const [spinning, setSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [winMessage, setWinMessage] = useState<{
    text: string;
    icon?: string;
  } | null>(null);
  const [winningIndices, setWinningIndices] = useState<number[][][]>([]);

  // Weighted randomness for client-side animation only
  const weightedItems: string[] = [
    ...Array<string>(60).fill("cherry"), // Increased
    ...Array<string>(30).fill("mouse"), // Increased
    ...Array<string>(20).fill("heart"), // Increased
    ...Array<string>(10).fill("sword"), // Same
    ...Array<string>(5).fill("diamonds"), // Rare
    ...Array<string>(80).fill("angry"), // Very Common
    ...Array<string>(40).fill("banana"), // Increased
  ];

  function getRandomItem() {
    return weightedItems[Math.floor(Math.random() * weightedItems.length)]!;
  }

  const initialRow = [
    getRandomItem(),
    getRandomItem(),
    getRandomItem(),
    getRandomItem(),
    getRandomItem(),
  ];
  const [matrix, setMatrix] = useState([initialRow, initialRow, initialRow]);

  async function handleClick() {
    if (spinning) return;

    setSpinning(true);
    setWinMessage(null);
    setWinningIndices([]);

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

        setSpinning(false);
      }
    }, intervalTime);
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#1a0b2e] to-[#0f0f1a] p-4 font-sans text-white">
      <div className="group absolute top-4 right-4 z-50">
        <button className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20">
          <Info className="h-6 w-6 text-purple-300" />
        </button>
        <div className="pointer-events-none absolute top-full right-0 mt-2 w-64 rounded-xl border border-purple-500/30 bg-black/90 p-4 text-left text-sm opacity-0 shadow-xl backdrop-blur-xl transition-opacity group-hover:opacity-100">
          <h3 className="mb-2 font-bold text-purple-300">
            Paytable (Base Bet 10)
          </h3>
          <div className="space-y-1 text-gray-300">
            <div className="flex justify-between">
              <span>💎 Diamond</span>
              <span>100</span>
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
          </div>
          <div className="mt-3 border-t border-white/10 pt-3">
            <h4 className="mb-1 font-bold text-purple-300">Multipliers</h4>
            <div className="flex justify-between text-xs text-gray-400">
              <span>3x Match</span>
              <span>20%</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>4x Match</span>
              <span>50%</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>5x Match</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 text-center">
        <h1 className="bg-linear-to-r from-purple-400 to-pink-600 bg-clip-text text-4xl font-extrabold tracking-tighter text-transparent drop-shadow-lg md:text-6xl">
          SLOTOVSKI
        </h1>
        <p className="mt-2 text-lg text-purple-300">Spin to Win!</p>
      </div>

      <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start">
        <div className="relative rounded-3xl border-4 border-purple-900 bg-black/80 p-4 shadow-2xl shadow-purple-900/50 md:border-8 md:p-8">
          {/* Machine Frame */}
          <div className="relative overflow-hidden rounded-xl border-4 border-yellow-600/50 bg-linear-to-b from-gray-900 to-black p-2 md:p-4">
            {/* Payline Indicator */}
            <div className="pointer-events-none absolute top-1/2 left-0 z-10 h-16 w-full md:h-24"></div>

            <div className="flex flex-col gap-2 md:gap-4">
              {matrix.map((row, rowIndex) => (
                <div
                  className={`flex flex-row justify-center gap-2 transition-all duration-100 md:gap-4`}
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
                        className={`flex h-14 w-14 items-center justify-center rounded-xl border bg-linear-to-br shadow-inner backdrop-blur-sm transition-all duration-300 sm:h-20 sm:w-20 md:h-24 md:w-24 ${
                          isWinning
                            ? "z-10 scale-110 border-yellow-400 from-yellow-900/50 to-purple-900/50 shadow-[0_0_20px_rgba(250,204,21,0.5)]"
                            : "border-white/10 from-purple-800/50 to-blue-900/50"
                        }`}
                      >
                        {Icon ? (
                          <Icon
                            className={`h-8 w-8 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] sm:h-10 sm:w-10 md:h-12 md:w-12 ${
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
          <div className="mt-8 flex flex-col items-center gap-6">
            <div className="h-8 text-xl font-bold text-yellow-400 drop-shadow-md md:h-12 md:text-2xl">
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

            <button
              onClick={handleClick}
              disabled={spinning}
              className={`group relative rounded-full px-8 py-3 text-xl font-bold tracking-wider uppercase transition-all duration-200 md:px-12 md:py-4 md:text-2xl ${
                spinning
                  ? "cursor-not-allowed bg-gray-700 text-gray-500"
                  : "bg-linear-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:scale-105 hover:from-pink-500 hover:to-purple-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.7)] active:scale-95"
              } `}
            >
              {spinning ? "Spinning..." : `SPIN (${betAmount})`}
            </button>
          </div>
        </div>

        {/* Side Panel */}
        <div className="flex w-full flex-col gap-6 rounded-3xl border-4 border-purple-900 bg-black/80 p-6 shadow-xl lg:w-auto">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-xl font-bold text-purple-300">Credits</h2>
            <div className="text-3xl font-bold text-yellow-400">{credits}</div>
          </div>

          <div className="h-px w-full bg-purple-800/50"></div>

          <div className="flex w-full flex-col items-center gap-4">
            <h2 className="text-xl font-bold text-purple-300">Bet Amount</h2>
            <div className="flex w-full flex-col items-center gap-3 px-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-700 text-xl font-bold hover:bg-purple-600 disabled:opacity-50"
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
                  className="w-24 border-b-2 border-purple-500/50 bg-transparent text-center text-3xl font-bold text-white focus:border-purple-500 focus:outline-none"
                  disabled={spinning}
                />
                <button
                  onClick={() => setBetAmount(betAmount + 10)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-700 text-xl font-bold hover:bg-purple-600 disabled:opacity-50"
                  disabled={spinning}
                >
                  +
                </button>
              </div>
              <input
                type="range"
                min="1"
                max={credits}
                step={credits >= 10 ? 10 : 1}
                value={betAmount}
                onChange={(e) => setBetAmount(parseInt(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-purple-900 accent-purple-500 hover:accent-purple-400"
                disabled={spinning}
              />
              <div className="flex w-full justify-between px-1 text-xs text-purple-400/50">
                <span>{Math.min(10, credits - 1)}</span>
                <span>{credits}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
