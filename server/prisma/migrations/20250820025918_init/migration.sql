/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Player` table. All the data in the column will be lost.
  - Added the required column `dateOfBirth` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `positionID` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Player" DROP COLUMN "createdAt",
DROP COLUMN "position",
DROP COLUMN "teamId",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "dateOfBirth" TEXT NOT NULL,
ADD COLUMN     "displayHeight" TEXT,
ADD COLUMN     "draftYear" INTEGER,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "headshot" TEXT,
ADD COLUMN     "height" TEXT,
ADD COLUMN     "jersey" INTEGER,
ADD COLUMN     "positionID" INTEGER NOT NULL,
ADD COLUMN     "shortName" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "weight" TEXT,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Player_id_seq";

-- CreateTable
CREATE TABLE "public"."Position" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "abbr" TEXT,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Player" ADD CONSTRAINT "Player_positionID_fkey" FOREIGN KEY ("positionID") REFERENCES "public"."Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
