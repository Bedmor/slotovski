"use client";

import { useState, useEffect } from "react";
import { Gift, Timer } from "lucide-react";
import { claimDailyReward } from "../actions";
import { useRouter } from "next/navigation";

interface DailyRewardProps {
  lastDailyReward: Date | null;
}

export function DailyReward({ lastDailyReward }: DailyRewardProps) {
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
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
      if (result.success) {
        alert(result.message);
        router.refresh();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to claim reward");
    } finally {
      setLoading(false);
    }
  };

  if (timeLeft) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-400">
        <Timer size={16} />
        <span>Next reward in: {timeLeft}</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleClaim}
      disabled={loading}
      className="group relative flex items-center gap-2 rounded-lg bg-linear-to-r from-yellow-500 to-orange-500 px-4 py-2 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-orange-500/20 disabled:opacity-50"
    >
      <Gift size={20} className="transition-transform group-hover:rotate-12" />
      {loading ? "Claiming..." : "Claim Daily Reward"}
    </button>
  );
}
