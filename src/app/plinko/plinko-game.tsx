"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, Info } from "lucide-react";
import Link from "next/link";

import { play as playAction } from "./actions";
const MULTIPLIERS = [3, 2, 1.5, 1.25, 1, 0.75, 1, 1.25, 1.5, 2, 3];

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  settling?: boolean; // ball is on floor and moving toward bin center
  steering?: boolean; // ball is steering toward target before hitting floor
  targetBin?: number | null;
};

type Peg = {
  x: number;
  y: number;
  r: number;
};

const randomColor = (): string => {
  const palette = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#6B5B95", "#F2A65A"];
  return palette[Math.floor(Math.random() * palette.length)]!;
};

interface Props {
  initialCredits: number;
}

export default function PlinkoGame({ initialCredits }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [credits, setCredits] = useState(initialCredits);
  const [displayCredits, setDisplayCredits] = useState(initialCredits);
  const finalCreditsRef = useRef<number | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [numToSpawn, setNumToSpawn] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [autoSpawn, setAutoSpawn] = useState(false);
  const [bins, setBins] = useState<number[]>([]);
  const ballsRef = useRef<Ball[]>([]);
  const particlesRef = useRef<
    {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      r: number;
      color: string;
    }[]
  >([]);
  const pegsRef = useRef<Peg[]>([]);
  const dprRef = useRef(1);
  const spawnIndexRef = useRef(0);
  const spawnTargetsRef = useRef<number[]>([]);
  const spawnIntervalRef = useRef<number | null>(null);

  const gravity = 1200;
  const elasticity = 0.88;
  const friction = 0.999;
  const baseBallRadius = 6;
  const ballRadiusRef = useRef<number>(baseBallRadius);
  const basePegRadius = 6;
  const pegRadiusRef = useRef<number>(basePegRadius);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      dprRef.current = dpr;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const recalcPegs = () => {
      const canvas = canvasRef.current!;
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      // Base columns target; will be reduced on small screens to preserve spacing
      let cols = 11;
      const rows = Math.floor(h / 60);
      const pegs: Peg[] = [];
      const offsetX = Math.max(20, Math.round(w * 0.05));
      // make peg layout responsive: smaller startY and spacing on small screens
      const startY = Math.max(70, Math.round(h * 0.12));
      let spacingX = (w - offsetX * 2) / (cols - 1);
      // compute responsive peg radius and update ref so collisions/draws use correct radius
      const minScale = 0.6;
      const scale = Math.min(1, Math.max(minScale, w / 420));
      const newPegRadius = Math.max(3, Math.round(basePegRadius * scale));
      pegRadiusRef.current = newPegRadius;
      const spacingY = Math.max(40, Math.round(h / Math.max(4, rows + 1)));
      // Minimum spacing to allow the balls to pass between pegs comfortably
      const currentPegRadius = pegRadiusRef.current ?? basePegRadius;
      const currentBallRadius = ballRadiusRef.current ?? baseBallRadius;
      const minSpacing = Math.max(
        36,
        2 * (currentBallRadius + currentPegRadius) + 4,
      );
      // Reduce the number of columns on small screens while keeping spacing >= minSpacing
      if (spacingX < minSpacing) {
        const usableWidth = Math.max(1, w - offsetX * 2);
        cols = Math.max(5, Math.floor(usableWidth / minSpacing) + 1);
        spacingX = usableWidth / (cols - 1);
      }

      // If we ended up with very small spacing, shrink ball radius to keep things playable
      if (spacingX < minSpacing * 1.1) {
        // scale down slightly more in extremely narrow configurations
        const scale = Math.max(0.5, spacingX / minSpacing);
        ballRadiusRef.current = Math.max(
          3,
          Math.round(baseBallRadius * Math.max(0.6, scale)),
        );
      } else {
        ballRadiusRef.current = baseBallRadius;
      }

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x =
            offsetX + col * spacingX + (row % 2 === 0 ? spacingX / 2 : 0);
          const y = startY + row * spacingY;
          if (
            x - currentPegRadius > 0 &&
            x + currentPegRadius < w &&
            y + currentPegRadius < h - 80
          ) {
            pegs.push({ x, y, r: currentPegRadius });
          }
        }
      }

      pegsRef.current = pegs;
      // Keep authoritative bin count tied to multipliers/server (11) instead of peg columns
      setBins(new Array(MULTIPLIERS.length).fill(0));
      ballsRef.current = [];
      spawnIndexRef.current = 0;
    };
    recalcPegs();
    window.addEventListener("resize", recalcPegs);
    return () => window.removeEventListener("resize", recalcPegs);
  }, []);

  const spawnBall = (targetBin?: number | null) => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const w = canvas.clientWidth;
    const xPos = w / 2 + (Math.random() - 0.5) * 30;
    const b: Ball = {
      x: xPos,
      y: 20 + Math.random() * 8,
      vx: (Math.random() - 0.5) * 60,
      vy: 0,
      r: ballRadiusRef.current,
      color: randomColor(),
      // resting not used; using settling flag instead
      settling: false,
      steering: false,
      targetBin: typeof targetBin === "number" ? targetBin : null,
    };
    ballsRef.current.push(b);
  };

  function spawnParticles(x: number, y: number, color: string) {
    const p = particlesRef.current;
    const count = 10;
    for (let i = 0; i < count; i++) {
      const speed = 60 + Math.random() * 80;
      const angle = Math.PI * 2 * Math.random();
      p.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 40,
        life: 0.6 + Math.random() * 0.4,
        r: 2 + Math.random() * 2,
        color,
      });
    }
  }

  const handlePlay = async () => {
    if (spinning) return;
    if (!betAmount || betAmount <= 0) return;
    if (credits < betAmount * numToSpawn) return alert("Insufficient credits");

    const totalStake = betAmount * numToSpawn;
    // Immediately show the credits after stake deduction
    setDisplayCredits((c) => c - totalStake);
    setSpinning(true);

    const result = await playAction(betAmount, numToSpawn);
    if ("error" in result) {
      alert(result.error);
      setSpinning(false);
      return;
    }

    const { ballBins, bins: serverBins, newCredits } = result;

    // Initialize visual bins to 0 and let the client count up as balls land.
    setBins(new Array(serverBins.length).fill(0));
    // stored for potential UI, but not used currently
    // Store authoritative server value; update state without instantly changing visible credits
    if (typeof newCredits === "number") {
      finalCreditsRef.current = newCredits;
      setCredits(newCredits);
      // If no animation required (single ball or no balls), update display immediately
      if (numToSpawn <= 1) setDisplayCredits(newCredits);
    }

    // prepare spawn targets
    spawnTargetsRef.current = ballBins;
    ballsRef.current = [];
    spawnIndexRef.current = 0;

    // spawn on interval for nice animation
    if (spawnIntervalRef.current)
      window.clearInterval(spawnIntervalRef.current);
    spawnIntervalRef.current = window.setInterval(() => {
      if (spawnIndexRef.current >= spawnTargetsRef.current.length) {
        if (spawnIntervalRef.current) {
          window.clearInterval(spawnIntervalRef.current);
          spawnIntervalRef.current = null;
          // after spawn complete, stop spawning and end spinning (keep until balls settle)
          setSpinning(false);
          // If no balls are in flight (rare), set displayCredits to final
          setTimeout(() => {
            if (
              (ballsRef.current?.length ?? 0) === 0 &&
              finalCreditsRef.current !== null
            ) {
              setDisplayCredits(finalCreditsRef.current);
            }
          }, 0);
        }
        return;
      }
      const target = spawnTargetsRef.current[spawnIndexRef.current];
      spawnBall(target);
      spawnIndexRef.current++;
    }, 70);
  };

  const stopSpawning = () => {
    if (spawnIntervalRef.current) {
      window.clearInterval(spawnIntervalRef.current);
      spawnIntervalRef.current = null;
    }
    setSpinning(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let last = performance.now();

    const update = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.04);
      last = t;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const dpr = dprRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // draw pegs
      ctx.fillStyle = "#333333";
      for (const peg of pegsRef.current) {
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, peg.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // draw floor and bins
      const binsCount = Math.max(1, bins.length);
      const binW = w / binsCount;
      const floorY = h - 48;
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#222";
      ctx.beginPath();
      ctx.moveTo(0, floorY);
      ctx.lineTo(w, floorY);
      ctx.stroke();
      for (let i = 0; i <= binsCount; i++) {
        ctx.beginPath();
        const x = i * binW;
        ctx.moveTo(x, floorY);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // draw center divider lines
      ctx.fillStyle = "#111";
      ctx.font = "12px Arial";
      for (let i = 0; i < binsCount; i++) {
        const x = i * binW + binW / 2;
        const mul = MULTIPLIERS[i] ?? 0;
        // Draw multiplier and per-ball win inside the bin area
        const perBall = Math.round(betAmount * mul);
        ctx.fillStyle = "#fff";
        ctx.font = "12px Arial";
        ctx.fillText(`${mul.toFixed(2)}x`, x - 14, floorY + 12);
        ctx.fillStyle = "#bdbdbd";
        ctx.fillText(String(perBall), x - 10, floorY + 28);
        // Draw bin counts at bottom of the bin area
        ctx.fillStyle = "#111";
        ctx.fillText(String(bins[i] ?? 0), x - 6, floorY + 44);
      }

      const binsLocal = [...bins];
      const balls = ballsRef.current;
      for (let j = balls.length - 1; j >= 0; j--) {
        const ball = balls[j];
        if (!ball) continue;

        if (!ball.settling) {
          // Normal physics
          ball.vy += gravity * dt;
          ball.vx *= friction;
          ball.vy *= friction;
          ball.x += ball.vx * dt;
          ball.y += ball.vy * dt;

          // wall collisions
          if (ball.x - ball.r < 0) {
            ball.x = ball.r;
            ball.vx = -ball.vx * elasticity;
          }
          if (ball.x + ball.r > w) {
            ball.x = w - ball.r;
            ball.vx = -ball.vx * elasticity;
          }

          // peg collisions
          for (const peg of pegsRef.current) {
            const dx = ball.x - peg.x;
            const dy = ball.y - peg.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < ball.r + peg.r && dist > 0) {
              const nX = dx / dist;
              const nY = dy / dist;
              const overlap = ball.r + peg.r - dist;
              ball.x += nX * overlap + nX * 0.01;
              ball.y += nY * overlap + nY * 0.01;
              const vdotn = ball.vx * nX + ball.vy * nY;
              ball.vx -= (1 + elasticity) * vdotn * nX;
              ball.vy -= (1 + elasticity) * vdotn * nY;
              ball.vx += (Math.random() - 0.5) * 5;
              ball.vy += (Math.random() - 0.5) * 5;
            }
          }

          // start steering a bit earlier if near the floor and we have a target
          const steerStartDistance = 140; // px above the floor to start steering
          if (
            !ball.steering &&
            ball.y + ball.r >= floorY - steerStartDistance
          ) {
            ball.steering = true;
          }

          // if steering, slowly apply horizontal force toward the target center
          if (ball.steering) {
            const binsCount = Math.max(1, binsLocal.length);
            const binW = w / binsCount;
            const target =
              typeof ball.targetBin === "number"
                ? ball.targetBin
                : Math.max(
                    0,
                    Math.min(binsCount - 1, Math.floor(ball.x / binW)),
                  );
            const targetCenter = target * binW + binW / 2;
            const dx = targetCenter - ball.x;
            const steerAccel = dx * 3; // gentler steering while in air
            ball.vx += steerAccel * dt;
            const maxSteerVx = 90;
            if (ball.vx > maxSteerVx) ball.vx = maxSteerVx;
            if (ball.vx < -maxSteerVx) ball.vx = -maxSteerVx;
          }

          // floor collision -> begin settling
          if (ball.y + ball.r >= floorY) {
            // will determine target in settling phase
            // position ball just above floor
            ball.y = floorY - ball.r - 0.5;
            ball.vy = 0;
            ball.settling = true;
            ball.steering = false; // stop steering once settling
          }
        } else {
          // Settling logic: move toward assigned or nearest bin smoothly
          const binsCount = Math.max(1, binsLocal.length);
          const binW = w / binsCount;
          const target =
            typeof ball.targetBin === "number"
              ? ball.targetBin
              : Math.max(0, Math.min(binsCount - 1, Math.floor(ball.x / binW)));
          // finalize if close and slow
          if (true) {
            const finalBin = target;
            binsLocal[finalBin] = (binsLocal[finalBin] ?? 0) + 1;
            spawnParticles(ball.x, ball.y, ball.color);
            balls.splice(j, 1);
            // Update display credits incrementally per ball
            const perBallWin = Math.round(
              betAmount * (MULTIPLIERS[finalBin] ?? 0),
            );
            setDisplayCredits((prev) => {
              const next = prev + perBallWin;
              const final = finalCreditsRef.current ?? next;
              return Math.min(next, final);
            });
            continue;
          }
        }

        // draw ball
        ctx.beginPath();
        ctx.fillStyle = ball.color;
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // if spawn finished and no balls are in flight yet, and we have finalCredits, ensure displayCredits reaches final.
      if (
        spawnIntervalRef.current === null &&
        (ballsRef.current?.length ?? 0) === 0 &&
        finalCreditsRef.current !== null
      ) {
        setDisplayCredits(finalCreditsRef.current);
      }

      // update particles
      const particles = particlesRef.current;
      for (let k = particles.length - 1; k >= 0; k--) {
        const p = particles[k];
        if (!p) continue;
        p.vy += gravity * dt * 0.6; // lighter gravity on particles
        p.vx *= 0.985;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        // draw particle
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 1));
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        if (p.life <= 0 || p.y > h + 50) particles.splice(k, 1);
      }

      // update bins state
      const binsChanged = binsLocal.some((v, i) => v !== bins[i]);
      if (binsChanged) setBins(binsLocal);

      // HUD
      ctx.fillStyle = "#000";
      ctx.font = "14px Arial";
      ctx.fillText(`Balls Active: ${ballsRef.current.length}`, 10, 22);
      ctx.fillText(`Spawned: ${spawnIndexRef.current}/${numToSpawn}`, 10, 40);

      rafRef.current = requestAnimationFrame(update);
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(update);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [bins, numToSpawn, betAmount, credits]);

  useEffect(() => {
    return () => {
      if (spawnIntervalRef.current) {
        window.clearInterval(spawnIntervalRef.current);
        spawnIntervalRef.current = null;
      }
    };
  }, []);

  // When authoritative credits change and there are no in-flight balls, reflect that in displayCredits
  useEffect(() => {
    if (
      (spawnIntervalRef.current === null ||
        spawnIntervalRef.current === undefined) &&
      (ballsRef.current?.length ?? 0) === 0
    ) {
      setDisplayCredits(credits);
    }
  }, [credits]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#1a0b2e] to-[#0f0f1a] p-4 text-white sm:p-8">
      <div className="mb-4 flex w-full max-w-6xl items-center justify-between sm:mb-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-sm font-bold text-purple-300 backdrop-blur-md transition hover:bg-black/60 hover:text-white sm:px-6 sm:py-3 sm:text-base"
        >
          ← Back
        </Link>
        <h1 className="bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-2xl font-black tracking-tighter text-transparent drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] sm:text-4xl md:text-5xl">
          PLINKO
        </h1>
        <div className="w-20 sm:w-[100px]"></div>
      </div>

      <div className="group absolute top-2 right-2 z-50 sm:top-4 sm:right-4">
        <button className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20">
          <Info className="h-6 w-6 text-purple-300" />
        </button>
        <div className="pointer-events-none absolute top-full right-0 mt-2 w-64 rounded-xl border border-purple-500/30 bg-black/90 p-4 text-left text-sm opacity-0 shadow-xl backdrop-blur-xl transition-opacity group-hover:opacity-100">
          <h3 className="mb-2 font-bold text-purple-300">Plinko Payouts</h3>
          <div className="space-y-1 text-gray-300">
            <div className="flex justify-between">
              <span>Center</span>
              <span>3x</span>
            </div>
            <div className="flex justify-between">
              <span>Inner Center</span>
              <span>1.2x</span>
            </div>
            <div className="flex justify-between">
              <span>Near Center</span>
              <span>0.8x</span>
            </div>
            <div className="flex justify-between">
              <span>Mid-edge</span>
              <span>0.5x</span>
            </div>
            <div className="flex justify-between">
              <span>Edge</span>
              <span>0.1x</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full max-w-6xl flex-col items-start gap-8 lg:flex-row lg:items-start">
        <div className="relative flex w-full flex-col rounded-3xl border border-purple-500/20 bg-black/40 p-4 shadow-xl backdrop-blur-md sm:rounded-[3rem] sm:border-2 sm:p-8 lg:flex-1">
          <div className="relative overflow-hidden rounded-lg border-2 border-yellow-600/50 bg-linear-to-b from-gray-900 to-black p-1 sm:rounded-xl sm:border-4 sm:p-2 md:p-4">
            <div className="pointer-events-none absolute top-1/2 left-0 z-10 h-16 w-full md:h-24"></div>

            <div className="flex flex-col gap-1 sm:gap-2 md:gap-4">
              <div className="flex h-12 w-full items-center justify-center border-b border-white/5 py-2 text-sm text-white/80">
                Plinko Board
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
              <label className="text-sm font-bold tracking-widest text-purple-400 uppercase">
                Balls
              </label>
              <input
                type="range"
                min={1}
                max={300}
                value={numToSpawn}
                onChange={(e) => setNumToSpawn(Number(e.target.value))}
                className="h-2 w-full max-w-56 cursor-pointer appearance-none rounded-lg bg-purple-900/50 accent-purple-400 hover:accent-purple-300"
              />
              <span className="ml-2 min-w-[3ch] text-2xl font-bold text-white">
                {numToSpawn}
              </span>
            </div>

            <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row">
              <button
                onClick={handlePlay}
                disabled={spinning || credits < betAmount * numToSpawn}
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-black transition sm:w-auto ${spinning ? "cursor-not-allowed border border-gray-700 bg-gray-800 text-gray-600" : "border border-purple-400/30 bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:scale-105"}`}
              >
                <Play className="h-5 w-5" />
                {spinning ? "Playing..." : `Play (${betAmount * numToSpawn})`}
              </button>
              <button
                onClick={() => setAutoSpawn((s) => !s)}
                className={`w-full rounded-xl px-4 py-2 sm:w-auto ${autoSpawn ? "border border-red-500/50 bg-red-500/20 text-red-400" : "border border-purple-500/30 bg-purple-900/30 text-purple-300"}`}
              >
                {autoSpawn ? "Auto" : "Manual"}
              </button>
              <button
                onClick={stopSpawning}
                className="w-full rounded-xl border border-white/5 px-4 py-2 sm:w-auto"
              >
                Stop
              </button>
            </div>
          </div>

          <div className="mt-4 h-80 overflow-hidden rounded-xl border border-white/5 bg-black/60 p-2 sm:h-80 md:h-[520px] lg:h-[560px]">
            <canvas
              ref={canvasRef}
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                touchAction: "none",
              }}
            />
          </div>
        </div>

        <aside
          id="plinko-sidebar"
          className={`flex w-full flex-col gap-6 rounded-3xl border border-purple-500/20 bg-black/40 p-4 shadow-xl backdrop-blur-md sm:p-6 lg:w-80 ${showSidebar ? "" : "hidden sm:flex"} lg:sticky lg:top-28 lg:h-[calc(100vh-7rem)] lg:overflow-y-auto`}
        >
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-sm font-bold tracking-widest text-purple-400 uppercase">
              Credits
            </h2>
            <div className="text-2xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)] sm:text-4xl">
              {displayCredits}
            </div>
          </div>

          <div className="h-px w-full bg-linear-to-r from-transparent via-purple-500/30 to-transparent" />

          <div className="flex w-full flex-col items-center gap-4">
            <h2 className="text-sm font-bold tracking-widest text-purple-400 uppercase">
              Bet Amount
            </h2>
            <div className="flex w-full flex-col items-center gap-4">
              <div className="flex w-full items-center justify-between gap-2 rounded-xl border border-purple-500/20 bg-black/40 p-2">
                <button
                  onClick={() => setBetAmount(Math.max(1, betAmount - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 text-xl font-bold text-purple-300 transition-colors hover:bg-purple-500/40 hover:text-white"
                  disabled={spinning}
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
                  onClick={() => setBetAmount(betAmount + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 text-xl font-bold text-purple-300 transition-colors hover:bg-purple-500/40 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-300">
            Payouts per bin (multiplier):
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 sm:grid-cols-3">
            <div>Edge Bins: 0.1x</div>
            <div>Inner Edge: 0.3x</div>
            <div>Mid-edge: 0.5x</div>
            <div>Near Center: 0.8x</div>
            <div>Inner Center: 1.2x</div>
            <div>Center: 3.0x</div>
          </div>

          <div className="mt-2 border-t border-white/5 pt-3">
            <h3 className="text-sm font-bold text-purple-400">Bins</h3>
            <div className="mt-2 flex w-full flex-col gap-2">
              {bins.map((c, i) => (
                <div
                  key={i}
                  className="flex justify-between text-xs text-gray-200"
                >
                  <div>
                    Bin {i}: <span className="font-bold">{c}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs">{MULTIPLIERS[i]?.toFixed(2)}x</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
        {/* mobile show/hide details toggle */}
        <div className="mt-2 flex w-full justify-end sm:hidden">
          <button
            className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/80"
            onClick={() => setShowSidebar((s) => !s)}
            aria-controls="plinko-sidebar"
            aria-expanded={showSidebar}
          >
            {showSidebar ? "Hide Details" : "Show Details"}
          </button>
        </div>
      </div>
    </main>
  );
}
