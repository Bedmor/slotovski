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
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-400">
          <Timer size={16} />
          <span>Next reward in: {timeLeft}</span>
        </div>
      ) : (
        <button
          onClick={handleClaim}
          disabled={loading}
          className="group relative flex items-center gap-2 rounded-lg bg-linear-to-r from-yellow-500 to-orange-500 px-4 py-2 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-orange-500/20 disabled:opacity-50"
        >
          <Gift
            size={20}
            className="transition-transform group-hover:rotate-12"
          />
          {loading ? "Claiming..." : "Claim Daily Reward"}
        </button>
      )}

      {showModal && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-200">
          <div className="animate-in zoom-in-95 relative w-full max-w-md overflow-hidden rounded-2xl border border-purple-500/30 bg-gray-900 p-6 shadow-2xl duration-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div
                className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${isSuccess ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
              >
                {isSuccess ? <Gift size={32} /> : <X size={32} />}
              </div>

              <h3 className="mb-2 text-2xl font-bold text-white">
                {isSuccess ? "Reward Claimed!" : "Oops!"}
              </h3>

              <p className="mb-6 text-gray-300">{modalMessage}</p>

              <button
                onClick={() => setShowModal(false)}
                className="w-full rounded-xl bg-purple-600 py-3 font-bold text-white transition-colors hover:bg-purple-500"
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
