-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('DEMO', 'FREE', 'PRO', 'TEAM');

-- DropIndex
DROP INDEX "Project_slug_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isDemo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "tier" "Tier" NOT NULL DEFAULT 'FREE',
ALTER COLUMN "email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "RateLimit" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "ip" TEXT,
    "type" TEXT NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("id")
);
