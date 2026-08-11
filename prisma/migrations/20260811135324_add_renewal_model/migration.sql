-- CreateTable
CREATE TABLE "Renewal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "reminderEnabled" BOOLEAN NOT NULL DEFAULT false,
    "reminderDaysBefore" INTEGER,
    "websiteDomain" TEXT,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Renewal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Renewal_userId_idx" ON "Renewal"("userId");

-- AddForeignKey
ALTER TABLE "Renewal" ADD CONSTRAINT "Renewal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
