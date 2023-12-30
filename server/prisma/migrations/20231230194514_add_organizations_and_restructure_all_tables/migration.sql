/*
  Warnings:

  - The primary key for the `Bookmarks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `Bookmarks` table. All the data in the column will be lost.
  - The primary key for the `Categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `Categories` table. All the data in the column will be lost.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `categoryId` on table `Bookmarks` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `organizationId` to the `Categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bookmarks" DROP CONSTRAINT "Bookmarks_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Bookmarks" DROP CONSTRAINT "Bookmarks_userId_fkey";

-- DropForeignKey
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_userId_fkey";

-- AlterTable
ALTER TABLE "Bookmarks" DROP CONSTRAINT "Bookmarks_pkey",
DROP COLUMN "userId",
ALTER COLUMN "id" SET DEFAULT uuid_generate_v4(),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "categoryId" SET NOT NULL,
ALTER COLUMN "categoryId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Bookmarks_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Bookmarks_id_seq";

-- AlterTable
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_pkey",
DROP COLUMN "userId",
ADD COLUMN     "organizationId" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT uuid_generate_v4(),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Categories_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Categories_id_seq";

-- AlterTable
ALTER TABLE "Users" DROP CONSTRAINT "Users_pkey",
ALTER COLUMN "id" SET DEFAULT uuid_generate_v4(),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Users_id_seq";

-- CreateTable
CREATE TABLE "Organizations" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Organizations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Organizations" ADD CONSTRAINT "Organizations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmarks" ADD CONSTRAINT "Bookmarks_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
