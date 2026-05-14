/*
  Warnings:

  - You are about to drop the column `authorId` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `isVisible` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `topicId` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `albumId` on the `Photo` table. All the data in the column will be lost.
  - Added the required column `is_default` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `themeId` to the `Album` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "AlbumImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_shown" BOOLEAN NOT NULL DEFAULT true,
    "albumId" INTEGER,
    CONSTRAINT "AlbumImage_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PostLike" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" INTEGER,
    "userId" INTEGER,
    CONSTRAINT "PostLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PostLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PostHeart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" INTEGER,
    "userId" INTEGER,
    CONSTRAINT "PostHeart_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PostHeart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PostView" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" INTEGER,
    "userId" INTEGER,
    CONSTRAINT "PostView_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PostView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

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
INSERT INTO "new_Album" ("id", "yearId") SELECT "id", "yearId" FROM "Album";
DROP TABLE "Album";
ALTER TABLE "new_Album" RENAME TO "Album";
CREATE TABLE "new_Photo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT NOT NULL,
    "userId" INTEGER,
    "avatarForId" INTEGER,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Photo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Photo_avatarForId_fkey" FOREIGN KEY ("avatarForId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Photo" ("avatarForId", "filename", "id", "isVisible", "userId") SELECT "avatarForId", "filename", "id", "isVisible", "userId" FROM "Photo";
DROP TABLE "Photo";
ALTER TABLE "new_Photo" RENAME TO "Photo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
