-- CreateEnum
CREATE TYPE "LedgerType" AS ENUM ('INCOME', 'EXPENSE', 'CREDITOR', 'DEBTOR');

-- CreateEnum
CREATE TYPE "LedgerCategory" AS ENUM ('SALARY', 'BUSINESS', 'RENTAL', 'DIVIDEND', 'OTHER_INCOME', 'UTILITIES', 'MAINTENANCE', 'TAX', 'DEBT', 'PERSONAL', 'OTHER_EXPENSE', 'LOAN', 'MORTGAGE');

-- AlterEnum
ALTER TYPE "AssetCategory" ADD VALUE 'other';

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'ledger';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TransactionType" ADD VALUE 'income_added';
ALTER TYPE "TransactionType" ADD VALUE 'expense_added';

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "isForSale" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "LedgerType" NOT NULL,
    "category" "LedgerCategory" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
