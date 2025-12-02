export type CrashActiveBet = {
  playerId: string;
  betAmount: number;
  cashedOut?: boolean;
  cashedOutMultiplier?: number;
};

export type CrashRoundState = {
  running: boolean;
  multiplier: number;
  roundId?: string | null;
  phase: "betting" | "running" | "crashed" | "cooldown";
  timeLeft?: number; // seconds for betting phase
  activeBets: Record<string, CrashActiveBet>;
  pendingBets: Record<string, CrashActiveBet>;
  history: number[];
};
