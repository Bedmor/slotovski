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

  // Weighted randomness for client-side animation only
  const weightedItems: string[] = [
    ...Array<string>(40).fill("cherry"), // Increased from 10
    ...Array<string>(20).fill("mouse"), // Increased from 10
    ...Array<string>(15).fill("heart"), // Increased from 10
    ...Array<string>(10).fill("sword"), // Kept at 10
    ...Array<string>(5).fill("diamonds"), // Decreased from 10 (Jackpot harder)
    ...Array<string>(50).fill("angry"), // Increased from 20 (Common low win)
    ...Array<string>(30).fill("banana"), // Increased from 10
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

        setSpinning(false);
      }
    }, intervalTime);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#1a0b2e] to-[#0f0f1a] p-4 font-sans text-white">
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
            <div className="pointer-events-none absolute top-1/2 left-0 z-10 h-16 w-full -translate-y-1/2 border-y-2 border-yellow-500/30 bg-yellow-500/10 shadow-[0_0_20px_rgba(234,179,8,0.2)] md:h-24"></div>

            <div className="flex flex-col gap-2 md:gap-4">
              {matrix.map((row, rowIndex) => (
                <div
                  className={`flex flex-row justify-center gap-2 transition-all duration-100 md:gap-4 ${rowIndex === 1 ? "scale-105" : "scale-95 opacity-70"}`}
                  key={rowIndex}
                >
                  {row.map((itemKey, colIndex) => {
                    const Icon = iconMap[itemKey];
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-linear-to-br from-purple-800/50 to-blue-900/50 shadow-inner backdrop-blur-sm sm:h-20 sm:w-20 md:h-24 md:w-24"
                      >
                        {Icon ? (
                          <Icon
                            className={`h-8 w-8 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] sm:h-10 sm:w-10 md:h-12 md:w-12 ${itemKey === "diamonds" ? "text-cyan-300" : itemKey === "heart" ? "text-red-400" : itemKey === "cherry" ? "text-red-500" : itemKey === "banana" ? "text-yellow-400" : "text-white"}`}
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

          <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-bold text-purple-300">Bet Amount</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-700 text-2xl font-bold hover:bg-purple-600 disabled:opacity-50"
                disabled={spinning}
              >
                -
              </button>
              <span className="min-w-[3ch] text-center text-3xl font-bold text-white">
                {betAmount}
              </span>
              <button
                onClick={() => setBetAmount(betAmount + 10)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-700 text-2xl font-bold hover:bg-purple-600 disabled:opacity-50"
                disabled={spinning}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
