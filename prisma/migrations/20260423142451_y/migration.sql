-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AlbumYear" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL DEFAULT 2024
);
INSERT INTO "new_AlbumYear" ("id", "year") SELECT "id", "year" FROM "AlbumYear";
DROP TABLE "AlbumYear";
ALTER TABLE "new_AlbumYear" RENAME TO "AlbumYear";
CREATE UNIQUE INDEX "AlbumYear_year_key" ON "AlbumYear"("year");
CREATE TABLE "new_Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL DEFAULT 'Nature'
);
INSERT INTO "new_Tag" ("id", "name") SELECT "id", "name" FROM "Tag";
DROP TABLE "Tag";
ALTER TABLE "new_Tag" RENAME TO "Tag";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
