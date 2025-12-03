"use client";
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { getCredits, placeBet, cashOut, getLastCrashes } from "./actions";
import type { CrashState } from "./types";

type Point = { x: number; y: number };

export default function CrashPage() {
  const [state, setState] = useState<CrashState>({
    roundId: null,
    phase: "betting",
    currentMultiplier: 1.0,
  });
  const [credits, setCredits] = useState<number>(0);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [placing, startPlacing] = useTransition();
  const [cashing, startCashing] = useTransition();
  const [myBet, setMyBet] = useState<{
    amount: number;
    cashedOutAt: number | null;
  } | null>(null);
  const [lastCrashes, setLastCrashes] = useState<number[]>([]);
  const [countdown, setCountdown] = useState<number>(0);

  const pointsRef = useRef<Point[]>([]);
  const [points, setPoints] = useState<Point[]>([]);

  // Initial credits are shown as 0 and update after first action

  // Connect SSE for crash state
  useEffect(() => {
    const es = new EventSource("/api/crash/sse");
    function isCrashUpdate(
      x: unknown,
    ): x is { type: "crash_update"; state: CrashState } {
      return (
        !!x &&
        typeof x === "object" &&
        (x as any).type === "crash_update" &&
        typeof (x as any).state === "object"
      );
    }

    es.onmessage = (ev) => {
      try {
        const payloadUnknown = JSON.parse(String(ev.data)) as unknown;
        if (isCrashUpdate(payloadUnknown)) {
          const s = payloadUnknown.state;
          setState(s);
          if (s.phase === "running" && s.startTime) {
            const elapsed = Date.now() - s.startTime;
            const x = elapsed / 1000; // seconds
            const y = s.currentMultiplier;
            const newPt = { x, y };
            pointsRef.current = [...pointsRef.current, newPt];
            setPoints(pointsRef.current.slice());
          } else if (s.phase === "betting") {
            pointsRef.current = [];
            setPoints([]);
          } else if (s.phase === "crashed" && s.crashPoint) {
            setLastCrashes((prev: number[]) =>
              [Number(s.crashPoint), ...prev].slice(0, 12),
            );
          }
        }
      } catch {}
    };
    return () => es.close();
  }, []);

  // Reset my bet tracker on new round
  useEffect(() => {
    if (state.phase === "betting") setMyBet(null);
  }, [state.phase, state.roundId]);

  // Load last 12 crashes at mount
  useEffect(() => {
    void (async () => {
      const data = await getLastCrashes(12);
      if (Array.isArray(data)) setLastCrashes(data);
    })();
  }, []);

  const canBet = state.phase === "betting";
  const canCashOut =
    state.phase === "running" && myBet && myBet.cashedOutAt == null;

  const cashOutValue = useMemo(() => {
    if (!myBet || state.phase !== "running") return 0;
    return Math.floor(myBet.amount * state.currentMultiplier);
  }, [myBet, state]);

  const handlePlaceBet = () => {
    if (!canBet) return;
    startPlacing(async () => {
      const res = await placeBet(Math.floor(betAmount));
      if ("error" in res) {
        alert(res.error);
      } else {
        setCredits(res.credits ?? credits);
        setMyBet({ amount: Math.floor(betAmount), cashedOutAt: null });
      }
    });
  };

  const handleCashOut = () => {
    if (!canCashOut) return;
    startCashing(async () => {
      const res = await cashOut();
      if ("error" in res) {
        alert(res.error);
      } else {
        setCredits(res.credits ?? credits);
        if (myBet)
          setMyBet({
            ...myBet,
            cashedOutAt: res.cashedOutAt ?? state.currentMultiplier,
          });
      }
    });
  };

  // Graph sizing & path
  const width = 900;
  const height = 420;
  const padding = 40;
  const maxX = Math.max(5, points[points.length - 1]?.x ?? 5);
  const maxY = Math.max(
    2,
    ...points.map((p) => p.y),
    state.phase === "crashed" ? (state.crashPoint ?? 1.5) : 0,
  );
  const sx = (x: number) => padding + (x / maxX) * (width - padding * 2);
  const sy = (y: number) =>
    height - padding - ((y - 1) / (maxY - 1)) * (height - padding * 2);
  // Build a smooth Catmull-Rom to Bezier path for nicer visuals
  const pathD = (() => {
    if (points.length === 0) return "";
    if (points.length === 1) {
      const p = points[0]!;
      return `M ${sx(p.x)} ${sy(p.y)}`;
    }
    const pts = points.map((p) => ({ x: sx(p.x), y: sy(p.y) }));
    let d = `M ${pts[0]!.x} ${pts[0]!.y}`;
    if (pts.length === 2) {
      d += ` L ${pts[1]!.x} ${pts[1]!.y}`;
      return d;
    }
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i === 0 ? pts[0]! : pts[i - 1]!;
      const p1 = pts[i]!;
      const p2 = pts[i + 1]!;
      const p3 = i + 2 < pts.length ? pts[i + 2]! : p2;
      // Catmull-Rom to Cubic Bezier conversion
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  })();

  const phaseLabel =
    state.phase === "betting"
      ? "BETTING"
      : state.phase === "running"
        ? "RUNNING"
        : "CRASHED";
  const timeLeftMs =
    state.phase === "betting"
      ? Math.max(0, (state.bettingEndsAt ?? Date.now()) - Date.now())
      : state.phase === "crashed"
        ? Math.max(0, (state.nextRoundStartsAt ?? Date.now()) - Date.now())
        : 0;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start overflow-x-hidden bg-linear-to-b from-[#1a0b2e] to-[#0f0f1a] p-3 font-sans text-white sm:p-6">
      <Link
        href="/"
        className="absolute top-2 left-2 rounded-lg bg-purple-800/50 px-3 py-2 text-sm transition-colors hover:bg-purple-700 sm:top-4 sm:left-4 sm:px-4"
      >
        🏠 Home
      </Link>

      <div className="mb-4 text-center sm:mb-6">
        <h1 className="bg-linear-to-r from-purple-400 to-pink-600 bg-clip-text text-3xl font-extrabold tracking-tighter text-transparent drop-shadow-lg sm:text-5xl">
          CRASH
        </h1>
        <p className="mt-1 text-base text-purple-300 sm:text-lg">
          Ride the curve, cash out in time.
        </p>
      </div>

      <div className="flex w-full max-w-6xl flex-col gap-4 md:flex-row">
        {/* Graph Card */}
        <div className="flex-1 rounded-2xl border-2 border-purple-900 bg-black/75 p-3 shadow-2xl sm:rounded-3xl sm:border-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-xs tracking-widest text-purple-400/80 uppercase">
                Status
              </div>
              <div
                className={`text-xl font-black ${state.phase === "running" ? "text-green-400" : state.phase === "betting" ? "text-yellow-400" : "text-red-400"}`}
              >
                {phaseLabel}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs tracking-widest text-purple-400/80 uppercase">
                Multiplier
              </div>
              <div className="text-3xl font-black text-white">
                {state.currentMultiplier.toFixed(2)}x
              </div>
            </div>
          </div>

          <div className="mb-3 flex w-full flex-wrap items-center gap-2">
            {lastCrashes.slice(0, 12).map((m, idx) => (
              <span
                key={idx}
                className={`${m < 2 ? "border border-red-800/40 bg-red-900/40 text-red-300" : m < 5 ? "border border-yellow-800/40 bg-yellow-900/30 text-yellow-300" : "border border-green-800/40 bg-green-900/30 text-green-300"} rounded-full px-3 py-1 text-sm font-bold`}
              >
                {m.toFixed(2)}x
              </span>
            ))}
          </div>

          <div className="relative w-full overflow-hidden rounded-xl border border-purple-500/20 bg-linear-to-b from-gray-950 to-black">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio="xMidYMid meet"
              className="mx-auto block h-[220px] w-full sm:h-80 md:h-[420px]"
            >
              {/* Axes */}
              <line
                x1={padding}
                y1={height - padding}
                x2={width - padding}
                y2={height - padding}
                stroke="#6b21a8"
                strokeOpacity={0.4}
              />
              <line
                x1={padding}
                y1={padding}
                x2={padding}
                y2={height - padding}
                stroke="#6b21a8"
                strokeOpacity={0.4}
              />

              {/* Path */}
              {points.length > 1 && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              )}

              {/* Crash marker */}
              {state.phase === "crashed" && state.crashPoint && (
                <g>
                  <line
                    x1={sx(points[points.length - 1]?.x ?? maxX)}
                    x2={sx(points[points.length - 1]?.x ?? maxX)}
                    y1={padding}
                    y2={height - padding}
                    stroke="#ef4444"
                    strokeDasharray="6 6"
                  />
                  <text
                    x={sx(points[points.length - 1]?.x ?? maxX) + 6}
                    y={sy(state.crashPoint)}
                    fill="#ef4444"
                    className="text-[12px]"
                  >
                    Crashed @ {state.crashPoint.toFixed(2)}x
                  </text>
                </g>
              )}

              {/* Ticks */}
              {Array.from({ length: 5 }).map((_, i) => {
                const y = 1 + ((maxY - 1) * i) / 4;
                return (
                  <g key={i}>
                    <line
                      x1={padding - 6}
                      x2={padding}
                      y1={sy(y)}
                      y2={sy(y)}
                      stroke="#7c3aed"
                      strokeOpacity={0.3}
                    />
                    <text
                      x={padding - 10}
                      y={sy(y) + 4}
                      textAnchor="end"
                      fill="#a78bfa"
                      className="text-[10px]"
                    >
                      {y.toFixed(1)}x
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Timers */}
          {(state.phase === "betting" || state.phase === "crashed") && (
            <div className="mt-3 text-center text-sm text-purple-300">
              Next phase in {Math.ceil(timeLeftMs / 1000)}s
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="w-full max-w-md rounded-2xl border-2 border-purple-900 bg-black/75 p-4 shadow-xl sm:rounded-3xl sm:border-4 sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-purple-300">Credits</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-yellow-400">
                {credits}
              </div>
              <button
                onClick={async () => setCredits((await getCredits()) ?? 0)}
                className="rounded-md border border-purple-600/40 bg-purple-700/30 px-2 py-1 text-xs text-purple-200 hover:bg-purple-700/50"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="h-px w-full bg-purple-800/40" />

          <div className="mt-4">
            <div className="mb-2 text-sm font-semibold text-purple-300">
              Bet Amount
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setBetAmount((b) => Math.max(1, b - 10))}
                disabled={!canBet || placing}
                className="h-10 w-10 rounded-full bg-purple-700 text-xl font-bold hover:bg-purple-600 disabled:opacity-40"
              >
                -
              </button>
              <input
                type="number"
                value={betAmount}
                onChange={(e) =>
                  setBetAmount(
                    Math.max(1, Number.parseInt(e.target.value) || 0),
                  )
                }
                className="w-24 rounded-md border border-purple-600/50 bg-transparent p-2 text-center text-xl font-bold text-white focus:border-purple-400 focus:outline-none"
                disabled={!canBet || placing}
              />
              <button
                onClick={() => setBetAmount((b) => b + 10)}
                disabled={!canBet || placing}
                className="h-10 w-10 rounded-full bg-purple-700 text-xl font-bold hover:bg-purple-600 disabled:opacity-40"
              >
                +
              </button>
            </div>
            <input
              type="range"
              min={1}
              max={Math.max(1, credits)}
              step={credits >= 10 ? 10 : 1}
              value={betAmount}
              onChange={(e) => setBetAmount(Number.parseInt(e.target.value))}
              className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-purple-900 accent-purple-500 hover:accent-purple-400"
              disabled={!canBet || placing}
            />
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <button
              onClick={handlePlaceBet}
              disabled={!canBet || placing || !!myBet}
              className={`rounded-full px-4 py-3 text-lg font-bold uppercase transition-colors ${canBet && !myBet ? "bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500" : "bg-gray-700 text-gray-400"}`}
            >
              {myBet
                ? `Bet Placed (${myBet.amount})`
                : placing
                  ? "Placing..."
                  : "Place Bet"}
            </button>

            <button
              onClick={handleCashOut}
              disabled={!canCashOut || cashing}
              className={`rounded-full px-4 py-3 text-lg font-bold uppercase transition-colors ${canCashOut ? "bg-green-600 hover:bg-green-500" : "bg-gray-700 text-gray-400"}`}
            >
              {canCashOut ? `Cash Out ${cashOutValue}` : "Cash Out"}
            </button>

            {myBet?.cashedOutAt != null && (
              <div className="rounded-md border border-green-600/40 bg-green-600/10 p-3 text-sm text-green-300">
                Cashed out at {myBet.cashedOutAt.toFixed(2)}x
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
