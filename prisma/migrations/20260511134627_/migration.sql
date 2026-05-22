/*
  Warnings:

  - Added the required column `profileId` to the `user_app_user` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user_app_user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstname" TEXT,
    "lastname" TEXT,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profileId" INTEGER NOT NULL,
    CONSTRAINT "user_app_user_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profile_app_profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_user_app_user" ("email", "firstname", "id", "lastname", "password", "username") SELECT "email", "firstname", "id", "lastname", "password", "username" FROM "user_app_user";
DROP TABLE "user_app_user";
ALTER TABLE "new_user_app_user" RENAME TO "user_app_user";
CREATE UNIQUE INDEX "user_app_user_email_key" ON "user_app_user"("email");
CREATE UNIQUE INDEX "user_app_user_profileId_key" ON "user_app_user"("profileId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
