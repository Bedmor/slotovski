-- CreateTable
CREATE TABLE "CrashGame" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "betAmount" INTEGER NOT NULL,
    "crashPoint" DOUBLE PRECISION NOT NULL,
    "cashOutPoint" DOUBLE PRECISION,
    "result" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrashGame_pkey" PRIMARY KEY ("id")
);
