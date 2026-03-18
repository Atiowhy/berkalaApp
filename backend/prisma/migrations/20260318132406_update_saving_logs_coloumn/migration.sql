-- CreateTable
CREATE TABLE "SavingLog" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "savingId" TEXT NOT NULL,

    CONSTRAINT "SavingLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SavingLog" ADD CONSTRAINT "SavingLog_savingId_fkey" FOREIGN KEY ("savingId") REFERENCES "Saving"("id") ON DELETE CASCADE ON UPDATE CASCADE;
