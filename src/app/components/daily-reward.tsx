"use client";

import { useState, useEffect } from "react";
import { Gift, Timer, X } from "lucide-react";
import { claimDailyReward } from "../actions";
import { useRouter } from "next/navigation";

interface DailyRewardProps {
  lastDailyReward: Date | null;
}

export function DailyReward({ lastDailyReward }: DailyRewardProps) {
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!lastDailyReward) return;

    const checkTime = () => {
      const now = new Date();
      const last = new Date(lastDailyReward);

      // Check if it's the same day
      const isSameDay =
        last.getDate() === now.getDate() &&
        last.getMonth() === now.getMonth() &&
        last.getFullYear() === now.getFullYear();

      if (isSameDay) {
        // Calculate time until midnight
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const diff = tomorrow.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(null);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [lastDailyReward]);

  const handleClaim = async () => {
    setLoading(true);
    try {
      const result = await claimDailyReward();
      setModalMessage(result.message);
      setIsSuccess(result.success);
      setShowModal(true);

      if (result.success) {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      setModalMessage("Failed to claim reward");
      setIsSuccess(false);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {timeLeft ? (
        <div className="flex items-center gap-2 rounded-xl border border-purple-500/20 bg-black/40 px-3 py-1.5 text-xs font-bold text-purple-300 backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm">
          <Timer
            className="h-4 w-4 animate-pulse text-purple-400 sm:h-5 sm:w-5"
            aria-hidden="true"
          />
          <span className="font-mono text-xs sm:text-sm" aria-live="polite">
            Next reward in: {timeLeft}
          </span>
        </div>
      ) : (
        <button
          onClick={handleClaim}
          disabled={loading}
          className="group relative flex w-full min-w-0 items-center gap-2 rounded-xl bg-linear-to-r from-yellow-500 to-orange-600 px-4 py-2 text-sm font-black tracking-wider text-white uppercase shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] disabled:opacity-50 sm:w-auto sm:px-6 sm:py-2 sm:text-base"
        >
          <Gift
            className="h-4 w-4 transition-transform group-hover:rotate-12 sm:h-5 sm:w-5"
            aria-hidden="true"
          />
          {loading ? "Claiming..." : "Claim Daily Reward"}
        </button>
      )}

      {showModal && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-200">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dailyRewardTitle"
            className="animate-in zoom-in-95 relative w-full max-w-xs overflow-hidden rounded-3xl border border-purple-500/30 bg-[#1a0b2e] p-6 shadow-[0_0_50px_rgba(168,85,247,0.2)] duration-200 sm:max-w-md sm:p-8"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 rounded-full bg-white/5 p-2 text-purple-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div
                className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 sm:h-20 sm:w-20 ${
                  isSuccess
                    ? "border-green-500/30 bg-green-500/20 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                    : "border-red-500/30 bg-red-500/20 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
                }`}
              >
                {isSuccess ? (
                  <Gift
                    className="h-10 w-10 sm:h-12 sm:w-12"
                    aria-hidden="true"
                  />
                ) : (
                  <X className="h-10 w-10 sm:h-12 sm:w-12" aria-hidden="true" />
                )}
              </div>

              <h3
                id="dailyRewardTitle"
                className="mb-2 text-2xl font-black tracking-wide text-white uppercase sm:text-3xl"
              >
                {isSuccess ? "Reward Claimed!" : "Oops!"}
              </h3>

              <p className="mb-8 text-base text-purple-200/70 sm:text-lg">
                {modalMessage}
              </p>

              <button
                onClick={() => setShowModal(false)}
                className="w-full rounded-xl bg-linear-to-r from-purple-600 to-pink-600 py-3 text-sm font-black tracking-wider text-white uppercase shadow-lg transition-all hover:scale-[1.02] hover:shadow-purple-500/25 sm:py-4 sm:text-base"
              >
                Awesome!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
