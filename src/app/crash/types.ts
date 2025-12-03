export type CrashPhase = "betting" | "running" | "crashed";

export type CrashState = {
  roundId: string | null;
  phase: CrashPhase;
  // When phase === "running"
  startTime?: number; // ms epoch
  currentMultiplier: number; // e.g., 1.00+
  // Chosen at round creation; not revealed to clients until crash
  crashPoint?: number | null;
  // When phase === "betting", countdown to start
  bettingEndsAt?: number; // ms epoch
  // When phase === "crashed", countdown to next betting round
  nextRoundStartsAt?: number; // ms epoch
};
