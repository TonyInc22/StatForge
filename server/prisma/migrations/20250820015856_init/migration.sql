/*
  Warnings:

  - You are about to drop the column `code` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `league` on the `Team` table. All the data in the column will be lost.
  - Added the required column `displayName` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leagueId` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Player" DROP CONSTRAINT "Player_teamId_fkey";

-- DropIndex
DROP INDEX "public"."Team_code_key";

-- AlterTable
ALTER TABLE "public"."Team" DROP COLUMN "code",
DROP COLUMN "createdAt",
DROP COLUMN "league",
ADD COLUMN     "abbr" TEXT,
ADD COLUMN     "alternateColor" TEXT,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "displayName" TEXT NOT NULL,
ADD COLUMN     "leagueId" INTEGER NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "logo" TEXT,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Team_id_seq";

-- CreateTable
CREATE TABLE "public"."Sport" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Sport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."League" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "abbr" TEXT,
    "sportId" INTEGER NOT NULL,

    CONSTRAINT "League_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sport_name_key" ON "public"."Sport"("name");

-- AddForeignKey
ALTER TABLE "public"."League" ADD CONSTRAINT "League_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "public"."Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "public"."League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
