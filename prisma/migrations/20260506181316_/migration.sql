/*
  Warnings:

  - You are about to drop the column `postId` on the `Photo` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "PostImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "original_image" TEXT NOT NULL,
    "postId" INTEGER,
    CONSTRAINT "PostImage_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Photo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT NOT NULL,
    "albumId" INTEGER,
    "userId" INTEGER,
    "avatarForId" INTEGER,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Photo_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Photo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Photo_avatarForId_fkey" FOREIGN KEY ("avatarForId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Photo" ("albumId", "avatarForId", "filename", "id", "isVisible", "userId") SELECT "albumId", "avatarForId", "filename", "id", "isVisible", "userId" FROM "Photo";
DROP TABLE "Photo";
ALTER TABLE "new_Photo" RENAME TO "Photo";
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("authorId", "content", "id", "title", "topic") SELECT "authorId", "content", "id", "title", "topic" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
