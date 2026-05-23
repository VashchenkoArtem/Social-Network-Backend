/*
  Warnings:

  - You are about to drop the column `href` on the `post_app_postlink` table. All the data in the column will be lost.
  - Added the required column `compressed_image` to the `post_app_postimage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `post_app_postlink` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_post_app_post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "post_app_post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_post_app_post" ("authorId", "content", "created_at", "id", "title", "topic", "updated_at") SELECT "authorId", "content", "created_at", "id", "title", "topic", "updated_at" FROM "post_app_post";
DROP TABLE "post_app_post";
ALTER TABLE "new_post_app_post" RENAME TO "post_app_post";
CREATE TABLE "new_post_app_postimage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "original_image" TEXT NOT NULL,
    "compressed_image" TEXT NOT NULL,
    "postId" INTEGER,
    CONSTRAINT "post_app_postimage_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post_app_post" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_post_app_postimage" ("id", "original_image", "postId") SELECT "id", "original_image", "postId" FROM "post_app_postimage";
DROP TABLE "post_app_postimage";
ALTER TABLE "new_post_app_postimage" RENAME TO "post_app_postimage";
CREATE TABLE "new_post_app_postlink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    CONSTRAINT "post_app_postlink_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post_app_post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_post_app_postlink" ("id", "postId") SELECT "id", "postId" FROM "post_app_postlink";
DROP TABLE "post_app_postlink";
ALTER TABLE "new_post_app_postlink" RENAME TO "post_app_postlink";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
