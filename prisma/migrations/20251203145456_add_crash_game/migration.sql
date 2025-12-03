-- CreateTable
CREATE TABLE "CrashGame" (
    "id" TEXT NOT NULL,
    "crashPoint" DOUBLE PRECISION NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,

    CONSTRAINT "CrashGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrashBet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "cashedOutAt" DOUBLE PRECISION,
    "winAmount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrashBet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CrashBet" ADD CONSTRAINT "CrashBet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrashBet" ADD CONSTRAINT "CrashBet_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "CrashGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
