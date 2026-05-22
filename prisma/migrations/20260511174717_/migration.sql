-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user_app_friendrequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT DEFAULT 'Pending',
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    CONSTRAINT "user_app_friendrequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_app_friendrequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_user_app_friendrequest" ("id", "receiverId", "senderId", "status") SELECT "id", "receiverId", "senderId", "status" FROM "user_app_friendrequest";
DROP TABLE "user_app_friendrequest";
ALTER TABLE "new_user_app_friendrequest" RENAME TO "user_app_friendrequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
