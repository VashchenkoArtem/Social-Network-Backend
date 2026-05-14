/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TagOnPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Tag_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Tag";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TagOnPost";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "post_app_post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "post_app_post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "post_app_post_tags" (
    "postId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    PRIMARY KEY ("postId", "tagId"),
    CONSTRAINT "post_app_post_tags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post_app_post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "post_app_post_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "post_app_tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "post_app_tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
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
    CONSTRAINT "Album_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "post_app_tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Album_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "AlbumYear" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Album" ("created_at", "id", "is_default", "is_shown", "name", "profileId", "themeId", "yearId") SELECT "created_at", "id", "is_default", "is_shown", "name", "profileId", "themeId", "yearId" FROM "Album";
DROP TABLE "Album";
ALTER TABLE "new_Album" RENAME TO "Album";
CREATE TABLE "new_PostHeart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" INTEGER,
    "userId" INTEGER,
    CONSTRAINT "PostHeart_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post_app_post" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PostHeart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PostHeart" ("id", "postId", "userId") SELECT "id", "postId", "userId" FROM "PostHeart";
DROP TABLE "PostHeart";
ALTER TABLE "new_PostHeart" RENAME TO "PostHeart";
CREATE TABLE "new_PostImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "original_image" TEXT NOT NULL,
    "postId" INTEGER,
    CONSTRAINT "PostImage_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post_app_post" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PostImage" ("id", "original_image", "postId") SELECT "id", "original_image", "postId" FROM "PostImage";
DROP TABLE "PostImage";
ALTER TABLE "new_PostImage" RENAME TO "PostImage";
CREATE TABLE "new_PostLike" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" INTEGER,
    "userId" INTEGER,
    CONSTRAINT "PostLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post_app_post" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PostLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PostLike" ("id", "postId", "userId") SELECT "id", "postId", "userId" FROM "PostLike";
DROP TABLE "PostLike";
ALTER TABLE "new_PostLike" RENAME TO "PostLike";
CREATE TABLE "new_PostUrl" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "href" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    CONSTRAINT "PostUrl_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post_app_post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PostUrl" ("href", "id", "postId") SELECT "href", "id", "postId" FROM "PostUrl";
DROP TABLE "PostUrl";
ALTER TABLE "new_PostUrl" RENAME TO "PostUrl";
CREATE TABLE "new_PostView" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" INTEGER,
    "userId" INTEGER,
    CONSTRAINT "PostView_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post_app_post" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PostView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PostView" ("id", "postId", "userId") SELECT "id", "postId", "userId" FROM "PostView";
DROP TABLE "PostView";
ALTER TABLE "new_PostView" RENAME TO "PostView";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "post_app_tag_name_key" ON "post_app_tag"("name");
