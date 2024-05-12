/*
  Warnings:

  - The values [EN,PTBR,FR] on the enum `UserLanguage` will be removed. If these variants are still used in the database, this will fail.
  - The values [LIGHT,DARK] on the enum `UserTheme` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserLanguage_new" AS ENUM ('en', 'ptbr', 'fr');
ALTER TABLE "User" ALTER COLUMN "language" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "language" TYPE "UserLanguage_new" USING ("language"::text::"UserLanguage_new");
ALTER TYPE "UserLanguage" RENAME TO "UserLanguage_old";
ALTER TYPE "UserLanguage_new" RENAME TO "UserLanguage";
DROP TYPE "UserLanguage_old";
ALTER TABLE "User" ALTER COLUMN "language" SET DEFAULT 'en';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserTheme_new" AS ENUM ('light', 'dark');
ALTER TABLE "User" ALTER COLUMN "theme" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "theme" TYPE "UserTheme_new" USING ("theme"::text::"UserTheme_new");
ALTER TYPE "UserTheme" RENAME TO "UserTheme_old";
ALTER TYPE "UserTheme_new" RENAME TO "UserTheme";
DROP TYPE "UserTheme_old";
ALTER TABLE "User" ALTER COLUMN "theme" SET DEFAULT 'dark';
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "language" SET DEFAULT 'en',
ALTER COLUMN "theme" SET DEFAULT 'dark';
