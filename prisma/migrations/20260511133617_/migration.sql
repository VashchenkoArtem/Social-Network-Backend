/*
  Warnings:

  - You are about to drop the `Photo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostHeart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostLike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostUrl` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostView` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Photo";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PostHeart";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PostImage";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PostLike";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PostUrl";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PostView";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "post_app_postlink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "href" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    CONSTRAINT "post_app_postlink_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post_app_post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "post_app_postimage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "original_image" TEXT NOT NULL,
    "postId" INTEGER,
    CONSTRAINT "post_app_postimage_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post_app_post" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "post_app_postlike" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" INTEGER,
    "userId" INTEGER,
    CONSTRAINT "post_app_postlike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post_app_post" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "post_app_postlike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profile_app_profile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "post_app_postheart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" INTEGER,
    "userId" INTEGER,
    CONSTRAINT "post_app_postheart_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post_app_post" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "post_app_postheart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profile_app_profile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "post_app_postview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" INTEGER,
    "userId" INTEGER,
    CONSTRAINT "post_app_postview_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post_app_post" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "post_app_postview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profile_app_profile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_app_user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstname" TEXT,
    "lastname" TEXT,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "profile_app_profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "signature" TEXT,
    "birth_date" DATETIME,
    "avatar" TEXT,
    "pseudonym" TEXT,
    "is_image_signature" BOOLEAN NOT NULL DEFAULT false,
    "is_text_signature" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "user_app_friendrequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    CONSTRAINT "user_app_friendrequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_app_friendrequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Album" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "is_shown" BOOLEAN NOT NULL DEFAULT true,
    "profileId" INTEGER NOT NULL,
    "theme" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_default" BOOLEAN NOT NULL,
    CONSTRAINT "Album_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profile_app_profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Album" ("created_at", "id", "is_default", "is_shown", "name", "profileId", "theme", "year") SELECT "created_at", "id", "is_default", "is_shown", "name", "profileId", "theme", "year" FROM "Album";
DROP TABLE "Album";
ALTER TABLE "new_Album" RENAME TO "Album";
CREATE TABLE "new_post_app_post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "post_app_post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "profile_app_profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_post_app_post" ("authorId", "content", "created_at", "id", "title", "topic", "updated_at") SELECT "authorId", "content", "created_at", "id", "title", "topic", "updated_at" FROM "post_app_post";
DROP TABLE "post_app_post";
ALTER TABLE "new_post_app_post" RENAME TO "post_app_post";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "user_app_user_email_key" ON "user_app_user"("email");
