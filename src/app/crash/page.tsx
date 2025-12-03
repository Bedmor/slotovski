"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import type { CrashRoundState } from "./types";
import {
  placeBet,
  cancelBet,
  cashOut,
  getCredits,
  getSessionUser,
} from "./actions";
import Link from "next/link";
import { Info } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const DEFAULT_BET = 10;

type PlaceBetResult =
  | { newCredits?: number }
  | { error?: string }
  | { payout?: number };

export default function CrashPage() {
  const { width, height } = useWindowSize();
  const [credits, setCredits] = useState<number | null>(null);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<number>(DEFAULT_BET);
  const [attending, setAttending] = useState(false);
  type MyBetState =
    | { status: "none" }
    | { status: "pending"; betAmount: number }
    | { status: "active"; betAmount: number; cashedOut?: boolean }
    | { status: "cashed"; payout: number };
  const [myBet, setMyBet] = useState<MyBetState>({ status: "none" });
  const myBetRef = useRef<MyBetState>(myBet);
  useEffect(() => {
    myBetRef.current = myBet;
  }, [myBet]);
  const [history, setHistory] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [phase, setPhase] = useState<
    "betting" | "running" | "crashed" | "cooldown"
  >("cooldown");
  // Countdown/Betting progress
  const [countdownLeft, setCountdownLeft] = useState<number | null>(null);
  const [countdownTotal, setCountdownTotal] = useState<number>(6);
  const sessionUserIdRef = useRef<string | null>(null);
  const attendingGraceRef = useRef<number | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const cashedOutRef = useRef(false);
  type GraphPoint = { t: number; m: number };
  const [graphData, setGraphData] = useState<GraphPoint[]>([]);
  const [emphasizedWin, setEmphasizedWin] = useState<{
    amount: number;
    id: number;
    multiplier?: number;
    betAmount?: number;
  } | null>(null);
  const [flyingCredits, setFlyingCredits] = useState<
    { id: number; amount: number; animating: boolean }[]
  >([]);
  const [creditPulse, setCreditPulse] = useState(false);
  const [countdownProgress, setCountdownProgress] = useState<number>(0);
  const targetCountdownRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const ringColor = useMemo(() => {
    const f = Math.max(0, Math.min(1, countdownProgress ?? 0));
    if (f > 0.66) return "#34D399"; // green
    if (f > 0.33) return "#FBBF24"; // yellow
    return "#F87171"; // red
  }, [countdownProgress]);
  const ringWidth = useMemo(() => {
    if (countdownLeft === null) return 3;
    return countdownLeft <= 2 ? 5 : 3;
  }, [countdownLeft]);
  // Update target fraction when countdown changes
  useEffect(() => {
    if (countdownLeft === null) {
      targetCountdownRef.current = 0;
      return;
    }
    const total = Math.max(1, countdownTotal ?? 1);
    targetCountdownRef.current = countdownLeft / total;
  }, [countdownLeft, countdownTotal]);

  // Reset progress when phase changes from betting
  useEffect(() => {
    if (phase !== "betting") {
      setCountdownLeft(null);
      setCountdownProgress(0);
      targetCountdownRef.current = 0;
    }
  }, [phase]);

  // RAF loop: animate countdownProgress towards target fraction
  useEffect(() => {
    let mounted = true;
    function tick() {
      setCountdownProgress((prev) => {
        const target = targetCountdownRef.current;
        const delta = target - prev;
        if (Math.abs(delta) < 0.001) return target;
        return prev + delta * 0.15;
      });
      if (!mounted) return;
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  // Simple RealtimeGraph: inline SVG sparkline
  function RealtimeGraph({
    data,
    width = 420,
    height = 110,
  }: {
    data: GraphPoint[];
    width?: number;
    height?: number;
  }) {
    const pad = 6;
    const innerW = Math.max(10, width - pad * 2);
    const innerH = Math.max(10, height - pad * 2);
    const minM = data.length ? Math.min(...data.map((d) => d.m), 1) : 1;
    const maxM = Math.max(2, ...data.map((d) => d.m));
    const pts = useMemo(() => {
      if (!data || data.length === 0) return [] as { x: number; y: number }[];
      const t0 = data[0]!.t;
      const t1 = data[data.length - 1]!.t || t0 + 1;
      const rangeT = Math.max(1, t1 - t0);
      return data.map((d) => {
        const x = pad + ((d.t - t0) / rangeT) * innerW;
        const yNorm = (d.m - minM) / Math.max(0.00001, maxM - minM);
        const y = pad + innerH - yNorm * innerH;
        return { x, y };
      });
    }, [data, pad, innerW, innerH, maxM, minM]);
    const poly = pts.map((p) => `${p.x},${p.y}`).join(" ");
    const firstPt = pts.length ? pts[0] : undefined;
    const lastPt = pts.length ? pts[pts.length - 1] : undefined;
    return (
      <svg width={width} height={height} className="mx-auto block">
        <defs>
          <linearGradient id="g1" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={8}
          fill="transparent"
        />
        {pts.length > 1 && (
          <polyline
            fill="none"
            stroke={`url(#g1)`}
            strokeWidth={2.5}
            points={poly}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {pts.length > 1 && firstPt && lastPt && (
          <path
            d={`M ${firstPt.x} ${height - pad} L ${pts.map((p) => `${p.x} ${p.y}`).join(" L ")} L ${lastPt.x} ${height - pad} Z`}
            fill="rgba(124,58,237,0.12)"
          />
        )}
        {lastPt && (
          <circle
            cx={lastPt.x}
            cy={lastPt.y}
            r={3.5}
            fill="#fff"
            stroke="#a78bfa"
            strokeWidth={1.5}
          />
        )}
      </svg>
    );
  }

  // SSE: Connect & update state
  useEffect(() => {
    const es = new EventSource("/api/crash/sse");
    eventSourceRef.current = es;
    const onMessage = (ev: MessageEvent) => {
      try {
        const parsed = JSON.parse(String(ev.data)) as Record<
          string,
          unknown
        > | null;
        if (!parsed) return;
        const type = typeof parsed.type === "string" ? parsed.type : null;
        if (!type) return;

        switch (type) {
          case "tick": {
            const m = parsed.multiplier as number | undefined;
            setMultiplier(
              typeof m === "number" ? m : Number(parsed.multiplier ?? 1),
            );
            // add graph point
            setGraphData((prev) => {
              const next = [
                ...prev.slice(-199),
                {
                  t: Date.now(),
                  m: typeof m === "number" ? m : Number(parsed.multiplier ?? 1),
                },
              ];
              return next;
            });
            setRunning(true);
            setPhase("running");
            break;
          }
          case "round_start": {
            setMultiplier(1);
            // clear graph at start of round
            setGraphData([]);
            setRunning(true);
            setPhase("running");
            setMessage("Round started!");
            setTimeout(() => setMessage(null), 2000);
            break;
          }
          case "crash": {
            const m = Number(parsed.multiplier ?? 1);
            setMultiplier(m);
            // last graph point: add crash point
            setGraphData((prev) => [...prev.slice(-199), { t: Date.now(), m }]);
            setRunning(false);
            setPhase("crashed");
            setMessage(`Crashed at ${m}x`);
            setHistory((h) => [m, ...h].slice(0, 12));
            setAttending(false);
            setTimeout(() => setMessage(null), 2500);
            break;
          }
          case "countdown": {
            // Update countdown ticks: the server emits 6,5,4...; keep total as initial countdown length
            const timeLeft = Number(parsed.timeLeft ?? 0);
            setPhase("betting");
            setMessage(`Betting: ${timeLeft}s`);
            setCountdownLeft(timeLeft);
            // Use functional update to avoid effect dependencies
            setCountdownTotal((prev) => (timeLeft > prev ? timeLeft : prev));
            break;
          }
          case "state": {
            const s = parsed.state as CrashRoundState | undefined;
            setRunning(Boolean(s?.running));
            setMultiplier(s?.multiplier ?? 1);
            setHistory(s?.history ?? []);
            const pRaw = s?.phase;
            function isPhase(
              v: unknown,
            ): v is "betting" | "running" | "crashed" | "cooldown" {
              return (
                typeof v === "string" &&
                ["betting", "running", "crashed", "cooldown"].includes(v)
              );
            }
            setPhase(isPhase(pRaw) ? pRaw : "cooldown");
            const userId = sessionUserIdRef.current ?? "";
            const pending = s?.pendingBets?.[userId] as
              | { betAmount?: number }
              | undefined;
            const active = s?.activeBets?.[userId] as
              | { betAmount?: number; cashedOut?: boolean }
              | undefined;
            const serverAttending = Boolean(pending ?? active);
            const now = Date.now();
            const inGrace =
              typeof attendingGraceRef.current === "number" &&
              attendingGraceRef.current > now;
            setAttending(serverAttending || inGrace);
            // Update myBet state
            if (pending)
              setMyBet({
                status: "pending",
                betAmount: pending.betAmount ?? betAmount,
              });
            else if (active) {
              if (active.cashedOut)
                setMyBet({
                  status: "cashed",
                  payout: Math.round(
                    (active.betAmount ?? 0) * (s?.multiplier ?? 1),
                  ),
                });
              else
                setMyBet({
                  status: "active",
                  betAmount: active.betAmount ?? 0,
                  cashedOut: false,
                });
            } else setMyBet({ status: "none" });
            break;
          }
          case "player_bet": {
            const pidRaw = parsed.playerId;
            const pid =
              typeof pidRaw === "string"
                ? pidRaw
                : typeof pidRaw === "number"
                  ? String(pidRaw)
                  : "";
            if (pid === sessionUserIdRef.current) {
              setAttending(true);
              setMessage("Bet placed — waiting for round");
            } else {
              setMessage(`Player ${pid} placed a bet`);
            }
            setTimeout(() => setMessage(null), 2000);
            break;
          }
          case "player_cashed_out": {
            const pidRaw = parsed.playerId;
            const pid =
              typeof pidRaw === "string"
                ? pidRaw
                : typeof pidRaw === "number"
                  ? String(pidRaw)
                  : "";
            const m =
              typeof parsed.multiplier === "number"
                ? parsed.multiplier
                : Number(parsed.multiplier ?? 1);
            if (pid === sessionUserIdRef.current) {
              setMessage(`You cashed out at ${m}x`);
              setAttending(false);
              attendingGraceRef.current = null;
              // emphasize the payout overlay for the player
              const payoutAmt = Number(parsed.payout ?? parsed.amount ?? 0);
              if (payoutAmt > 0) {
                const myBetAmount =
                  myBetRef.current &&
                  (myBetRef.current.status === "pending" ||
                    myBetRef.current.status === "active")
                    ? myBetRef.current.betAmount
                    : undefined;
                setEmphasizedWin({
                  amount: payoutAmt,
                  id: Date.now(),
                  multiplier: Number(m ?? 0),
                  betAmount: myBetAmount,
                });
              }
            } else setMessage(`Player ${pid} cashed out at ${m}x`);
            setTimeout(() => setMessage(null), 2000);
            break;
          }
          case "bet_cancelled": {
            const pidRaw = parsed.playerId;
            const pid =
              typeof pidRaw === "string"
                ? pidRaw
                : typeof pidRaw === "number"
                  ? String(pidRaw)
                  : "";
            if (pid === sessionUserIdRef.current) {
              setAttending(false);
              setMessage("Your bet was canceled");
            } else {
              setMessage(`Player ${pid} canceled their bet`);
            }
            setTimeout(() => setMessage(null), 2000);
            break;
          }
          default:
            break;
        }
      } catch {
        // ignore malformed event
      }
    };
    es.addEventListener("message", onMessage);

    return () => {
      try {
        es.close();
      } catch {}
      if (eventSourceRef.current === es) eventSourceRef.current = null;
    };
  }, [betAmount]);

  // Global site SSE for notifications from other games
  useEffect(() => {
    const siteEs = new EventSource(`/api/sse`);
    siteEs.onmessage = (ev: MessageEvent) => {
      try {
        const parsed = JSON.parse(String(ev.data)) as Record<
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
          // If this event is for crash itself, ignore (already handled)
          if (parsed.game === "crash") return;
          if (pid === sessionUserIdRef.current) {
            setMessage(`You won ${payout} credits!`);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
            // emphasized win overlay for the user's big wins from anywhere
            if (payout > 0) {
              const myBetAmount =
                myBetRef.current &&
                (myBetRef.current.status === "pending" ||
                  myBetRef.current.status === "active")
                  ? myBetRef.current.betAmount
                  : undefined;
              setEmphasizedWin({
                amount: payout,
                id: Date.now(),
                multiplier: Number(parsed.multiplier ?? 0),
                betAmount: myBetAmount,
              });
            }
          } else {
            setMessage(`Player ${pid} won ${payout} credits`);
            setTimeout(() => setMessage(null), 3000);
          }
        }
      } catch {}
    };
    siteEs.onerror = () => {
      try {
        siteEs.close();
      } catch {}
    };
    return () => {
      try {
        siteEs.close();
      } catch {}
    };
  }, []);

  useEffect(() => {
    let canceled = false;
    void (async () => {
      try {
        const session = await getSessionUser();
        if (canceled) return;
        sessionUserIdRef.current = session.userId ?? null;
        setCredits(session.credits ?? null);
      } catch {
        // ignore
      }
    })();
    return () => {
      canceled = true;
    };
  }, []);

  // Remove emphasis overlay after a short duration
  useEffect(() => {
    if (!emphasizedWin) return;
    const tid = setTimeout(() => setEmphasizedWin(null), 3500);
    return () => clearTimeout(tid);
  }, [emphasizedWin]);

  // Show pulse on credits when a win overlay appears
  useEffect(() => {
    if (!emphasizedWin) return;
    setCreditPulse(true);
    const t = setTimeout(() => setCreditPulse(false), 1400);
    return () => clearTimeout(t);
  }, [emphasizedWin]);

  // Flying credit animation: add and auto-animate away
  useEffect(() => {
    if (!emphasizedWin) return;
    const id = emphasizedWin.id;
    const amount = emphasizedWin.amount;
    setFlyingCredits((s) => [...s, { id, amount, animating: false }]);
    // next tick: start animation
    const startT = setTimeout(() => {
      setFlyingCredits((s) =>
        s.map((f) => (f.id === id ? { ...f, animating: true } : f)),
      );
    }, 20);
    // remove after animation
    const removeT = setTimeout(() => {
      setFlyingCredits((s) => s.filter((f) => f.id !== id));
    }, 1600);
    return () => {
      clearTimeout(startT);
      clearTimeout(removeT);
    };
  }, [emphasizedWin]);

  async function refreshCredits() {
    try {
      const c = await getCredits();
      setCredits(c ?? null);
    } catch {
      // ignore
    }
  }

  async function onPlaceBet() {
    try {
      const r = (await placeBet(betAmount)) as PlaceBetResult;
      if (r && "error" in r) {
        setMessage(String(r.error));
        return;
      }
      if (r && "newCredits" in r) setCredits(r.newCredits ?? null);
      setAttending(true);
      setMyBet({ status: "pending", betAmount });
      // small grace window: keep attending for 3s to avoid races with server state
      attendingGraceRef.current = Date.now() + 3000;
    } catch {
      setMessage("Network error placing bet");
    }
  }

  async function onCancelBet() {
    try {
      const r = (await cancelBet()) as { ok?: boolean } | { error?: string };
      if (r && "error" in r) {
        setMessage(String(r.error));
        return;
      }
      setMessage("Bet canceled and refunded");
      setAttending(false);
      setMyBet({ status: "none" });
      attendingGraceRef.current = null;
      await refreshCredits();
    } catch {
      setMessage("Network error canceling bet");
    }
  }

  async function onCashOut() {
    try {
      const r = (await cashOut()) as { payout?: number } | { error?: string };
      if (r && "error" in r) {
        setMessage(String(r.error));
        return;
      }
      if (r && "payout" in r && typeof r.payout === "number") {
        setMessage(`Cashed out ${r.payout}!`);
        // big win celebration
        if (r.payout >= (betAmount ?? DEFAULT_BET) * 5) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
        await refreshCredits();
        cashedOutRef.current = true;
        setAttending(false);
        setMyBet({ status: "cashed", payout: r.payout ?? 0 });
        attendingGraceRef.current = null;
        // Emphasize the win in a big animated overlay with multiplier and bet amount
        const betAmt =
          myBetRef.current &&
          (myBetRef.current.status === "active" ||
            myBetRef.current.status === "pending")
            ? myBetRef.current.betAmount
            : undefined;
        const calcMultiplier = betAmt ? (r.payout ?? 0) / betAmt : undefined;
        setEmphasizedWin({
          amount: r.payout ?? 0,
          id: Date.now(),
          multiplier: calcMultiplier,
          betAmount: betAmt,
        });
      }
    } catch {
      setMessage("Network error cashing out");
    }
  }

  const canPlace =
    !attending && !running && (credits ?? 0) >= betAmount && betAmount >= 1;
  const betButtonClass = canPlace
    ? "group relative rounded-full px-6 py-3 text-base font-bold tracking-wider uppercase transition-all duration-200 sm:px-8 sm:py-3 sm:text-xl md:px-12 md:py-4 md:text-2xl bg-linear-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:scale-105 hover:from-pink-500 hover:to-purple-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.7)] active:scale-95"
    : "group relative rounded-full px-6 py-3 text-base font-bold tracking-wider uppercase transition-all duration-200 sm:px-8 sm:py-3 sm:text-xl md:px-12 md:py-4 md:text-2xl cursor-not-allowed bg-gray-700 text-gray-400";

  /* multiplier color based on value */
  function getMultiplierColor(m: number) {
    if (m < 2) return "text-red-400";
    if (m < 5) return "text-orange-400";
    if (m < 10) return "text-yellow-400";
    return "text-green-400";
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-linear-to-b from-[#1a0b2e] to-[#0f0f1a] p-2 font-sans text-white sm:p-4">
      <Link
        href="/"
        className="absolute top-2 left-2 rounded-lg bg-purple-800/50 px-3 py-2 text-sm font-bold hover:bg-purple-700"
      >
        🏠 Home
      </Link>

      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {/* Emphasized win overlay (big animated amount) */}
      {emphasizedWin && (
        <div className="pointer-events-none absolute inset-0 z-40 flex items-start justify-center pt-24">
          <div className="transform-gpu transition-all duration-300 ease-out">
            <div className="animate-pulse rounded-2xl bg-linear-to-r from-yellow-300 to-yellow-500 px-6 py-3 text-black shadow-2xl">
              <div className="text-sm font-bold text-black/70">You Won</div>
              <div className="text-3xl font-extrabold tracking-tight">
                {emphasizedWin.amount} credits
                {emphasizedWin.multiplier && (
                  <span className="ml-2 text-lg font-bold text-black/60">
                    · {emphasizedWin.multiplier.toFixed(2)}x
                  </span>
                )}
                {emphasizedWin.betAmount && (
                  <div className="mt-1 text-sm font-semibold text-black/70">
                    (bet {emphasizedWin.betAmount})
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="group absolute top-2 right-2 z-50 sm:top-4 sm:right-4">
        <button className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20">
          <Info className="h-5 w-5 text-purple-300" />
        </button>
        <div className="pointer-events-none absolute top-full right-0 mt-2 w-64 rounded-xl border border-purple-500/30 bg-black/90 p-4 text-left text-sm opacity-0 shadow-xl backdrop-blur-xl transition-opacity group-hover:opacity-100">
          <h3 className="mb-2 font-bold text-purple-300">Crash Rules</h3>
          <div className="text-sm text-gray-300">
            <ul className="list-disc pl-4">
              <li>
                Place a bet before the round starts (applies on next round).
              </li>
              <li>
                Cash out while the round is running to win based on the current
                multiplier.
              </li>
              <li>
                The round can crash at any time — cash out early to secure
                payout.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-4 text-center sm:mb-8">
        <h1 className="bg-linear-to-r from-purple-400 to-pink-600 bg-clip-text text-3xl font-extrabold tracking-tighter text-transparent">
          CRASH
        </h1>
        <p className="mt-1 text-base text-purple-300">
          Place a bet — cash out before the crash!
        </p>
      </div>

      <div className="flex w-full max-w-4xl flex-col-reverse items-start gap-6 lg:flex-row">
        <div className="flex-1 rounded-2xl border-2 border-purple-900 bg-black/80 p-6">
          <div className="relative overflow-hidden rounded-lg border-2 border-yellow-600/50 bg-linear-to-b from-gray-900 to-black p-4">
            {message && (
              <div className="mb-2 text-xl text-white/90">{message}</div>
            )}
            <div className="mb-1 text-xs text-gray-400">
              Phase: <span className="font-bold text-yellow-400">{phase}</span>
            </div>
            {phase === "betting" && countdownLeft !== null && (
              <div className="mb-2">
                <div className="mb-1 flex items-center justify-between text-xs text-gray-300">
                  <div>Betting</div>
                  <div
                    className={`font-bold ${countdownLeft !== null && countdownLeft <= 2 ? "animate-pulse text-red-300" : "text-yellow-200"}`}
                  >
                    {countdownLeft}s
                  </div>
                </div>
                <div className="h-3 w-full overflow-hidden rounded bg-purple-900/30">
                  <div
                    className="h-full rounded bg-yellow-400 transition-all"
                    style={{
                      width: `${Math.max(0, Math.min(1, countdownProgress)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
            <div
              className={`mb-2 text-5xl font-black drop-shadow-lg transition-transform sm:text-6xl md:text-8xl lg:text-9xl ${running ? "scale-105" : "scale-100"}`}
            >
              <span
                className={`inline-block ${getMultiplierColor(multiplier)} bg-clip-text`}
              >
                {multiplier.toFixed(2)}x
              </span>
            </div>
            <div className="graph mt-4 w-full overflow-hidden rounded-md bg-black/60 p-2">
              <RealtimeGraph
                data={graphData}
                width={Math.min(420, Math.max(320, width - 144))}
                height={110}
              />
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
              <div className="relative inline-block">
                <button
                  onClick={onPlaceBet}
                  disabled={!canPlace}
                  className={betButtonClass}
                >
                  Bet {betAmount}
                </button>
                {phase === "betting" && countdownLeft !== null && (
                  <div className="absolute -top-2 -right-2 z-50 flex items-center justify-center">
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-black/60">
                      {/* Animated ring */}
                      <svg className="absolute z-0 h-8 w-8" viewBox="0 0 36 36">
                        <path
                          className="text-purple-700/40"
                          d="M18 2.0845
                             a 15.9155 15.9155 0 0 1 0 31.831
                             a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="rgba(124,58,237,0.16)"
                          strokeWidth={ringWidth}
                        />
                        <path
                          strokeLinecap="round"
                          strokeWidth="3"
                          className="text-yellow-400"
                          d="M18 2.0845
                             a 15.9155 15.9155 0 0 1 0 31.831
                             a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={ringColor}
                          strokeDasharray={Math.PI * 2 * 15.9155}
                          style={{
                            strokeDashoffset:
                              (1 -
                                Math.max(0, Math.min(1, countdownProgress))) *
                              Math.PI *
                              2 *
                              15.9155,
                            transition:
                              "stroke-dashoffset 120ms linear, stroke 240ms linear, stroke-width 200ms linear",
                            stroke: ringColor,
                          }}
                        />
                      </svg>
                      <div
                        className={`z-10 text-xs font-bold text-white ${countdownLeft <= 2 ? "animate-pulse text-yellow-200" : "text-purple-200"}`}
                      >
                        {countdownLeft}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {attending && (
                <div className="flex w-full gap-2 sm:w-auto sm:gap-3">
                  {myBet.status === "pending" && (
                    <button
                      onClick={onCancelBet}
                      className="w-full rounded-full bg-red-600 px-4 py-2 font-bold sm:w-auto"
                    >
                      Cancel
                    </button>
                  )}
                  {myBet.status === "active" && (
                    <button
                      onClick={onCashOut}
                      disabled={!running}
                      className="w-full rounded-full bg-yellow-400 px-4 py-2 font-bold sm:w-auto"
                    >
                      Cash Out
                    </button>
                  )}
                  {myBet.status === "cashed" && (
                    <div className="w-full rounded bg-green-700 px-4 py-2 text-center text-sm font-bold text-white">
                      Cashed
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="w-full rounded-2xl border-2 border-purple-900 bg-black/80 p-4 sm:w-80">
          <div className="relative mb-4 text-center">
            <div className="text-sm text-purple-300">Credits</div>
            <div
              className={`text-2xl font-bold ${creditPulse ? "scale-105 transform animate-pulse text-yellow-200" : "text-yellow-400"}`}
            >
              {credits ?? "—"}
            </div>
            {/* Flying credit numbers */}
            <div className="pointer-events-none absolute top-0 left-1/2 mt-8 -translate-x-1/2">
              {flyingCredits.map((f) => (
                <div
                  key={f.id}
                  className={`text-sm font-extrabold text-yellow-300`}
                  style={{
                    transform: `translateY(${f.animating ? -28 : 0}px)`,
                    opacity: f.animating ? 0 : 1,
                    transition:
                      "transform 1200ms cubic-bezier(.25,.8,.25,1), opacity 900ms ease-out",
                    willChange: "transform, opacity",
                  }}
                >
                  +{f.amount}
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <div className="mb-1 text-sm text-purple-300">Bet Amount</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-700 text-xl font-bold hover:bg-purple-600 disabled:opacity-50"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                value={betAmount}
                onChange={(e) =>
                  setBetAmount(Math.max(1, parseInt(e.target.value || "0")))
                }
                className="w-20 border-b-2 border-purple-500/50 bg-transparent text-center text-2xl font-bold text-white focus:border-purple-500 focus:outline-none sm:w-24 sm:text-3xl"
              />
              <button
                onClick={() => setBetAmount(betAmount + 10)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-700 text-xl font-bold hover:bg-purple-600 disabled:opacity-50"
              >
                +
              </button>
            </div>
            <input
              type="range"
              min={1}
              max={Math.max(1, credits ?? 100)}
              step={1}
              value={betAmount}
              onChange={(e) => setBetAmount(parseInt(e.target.value || "1"))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-purple-900 accent-purple-500 hover:accent-purple-400"
            />
          </div>
          <div className="mb-3 text-sm font-bold text-purple-300">Recent</div>
          <div className="mb-4"></div>
          <div className="flex flex-wrap gap-2">
            {history.map((h, idx) => (
              <div
                key={idx}
                className={`rounded px-2 py-1 ${h < 2 ? "bg-red-600" : h < 5 ? "bg-orange-600" : "bg-green-500"}`}
              >
                {h}x
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
