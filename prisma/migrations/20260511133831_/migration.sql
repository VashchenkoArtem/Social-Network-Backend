/*
  Warnings:

  - You are about to drop the `Album` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AlbumImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Album";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AlbumImage";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "profile_app_album" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "is_shown" BOOLEAN NOT NULL DEFAULT true,
    "profileId" INTEGER NOT NULL,
    "theme" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_default" BOOLEAN NOT NULL,
    CONSTRAINT "profile_app_album_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profile_app_profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "profile_app_albumimage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image" TEXT NOT NULL,
    "is_shown" BOOLEAN NOT NULL DEFAULT true,
    "albumId" INTEGER,
    CONSTRAINT "profile_app_albumimage_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "profile_app_album" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
