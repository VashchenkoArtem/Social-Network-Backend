/*
  Warnings:

  - Added the required column `title` to the `Album` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Album" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "authorId" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,
    "dateId" INTEGER NOT NULL,
    CONSTRAINT "Album_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Album_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Album_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "CreatedAt" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Album" ("authorId", "dateId", "id", "isVisible", "topicId") SELECT "authorId", "dateId", "id", "isVisible", "topicId" FROM "Album";
DROP TABLE "Album";
ALTER TABLE "new_Album" RENAME TO "Album";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
