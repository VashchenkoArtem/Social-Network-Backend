/*
  Warnings:

  - You are about to drop the column `theme` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Album` table. All the data in the column will be lost.
  - Added the required column `themeId` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearId` to the `Album` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Album" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "is_shown" BOOLEAN NOT NULL DEFAULT true,
    "profileId" INTEGER NOT NULL,
    "themeId" INTEGER NOT NULL,
    "yearId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_default" BOOLEAN NOT NULL,
    CONSTRAINT "Album_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Album_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Album_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "AlbumYear" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Album" ("created_at", "id", "is_default", "is_shown", "name", "profileId") SELECT "created_at", "id", "is_default", "is_shown", "name", "profileId" FROM "Album";
DROP TABLE "Album";
ALTER TABLE "new_Album" RENAME TO "Album";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
