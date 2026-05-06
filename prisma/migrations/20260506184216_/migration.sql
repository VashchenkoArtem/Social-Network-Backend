/*
  Warnings:

  - Added the required column `image` to the `AlbumImage` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AlbumImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image" TEXT NOT NULL,
    "is_shown" BOOLEAN NOT NULL DEFAULT true,
    "albumId" INTEGER,
    CONSTRAINT "AlbumImage_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_AlbumImage" ("albumId", "created_at", "id", "is_shown") SELECT "albumId", "created_at", "id", "is_shown" FROM "AlbumImage";
DROP TABLE "AlbumImage";
ALTER TABLE "new_AlbumImage" RENAME TO "AlbumImage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
