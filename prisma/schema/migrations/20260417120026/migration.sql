/*
  Warnings:

  - You are about to drop the `CreatedAt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `dateId` on the `Album` table. All the data in the column will be lost.
  - Added the required column `yearId` to the `Album` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CreatedAt";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "AlbumYear" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Album" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "authorId" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,
    "yearId" INTEGER NOT NULL,
    CONSTRAINT "Album_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Album_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Album_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "AlbumYear" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Album" ("authorId", "id", "isVisible", "title", "topicId") SELECT "authorId", "id", "isVisible", "title", "topicId" FROM "Album";
DROP TABLE "Album";
ALTER TABLE "new_Album" RENAME TO "Album";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "AlbumYear_year_key" ON "AlbumYear"("year");
