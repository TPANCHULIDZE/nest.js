/*
  Warnings:

  - You are about to drop the column `descripion` on the `bookmarks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bookmarks" DROP COLUMN "descripion",
ADD COLUMN     "description" TEXT;
