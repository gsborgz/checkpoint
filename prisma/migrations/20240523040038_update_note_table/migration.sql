/*
  Warnings:

  - You are about to drop the column `pinned` on the `Note` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "pinned",
ADD COLUMN     "favorite" BOOLEAN NOT NULL DEFAULT false;
