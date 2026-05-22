-- CreateTable
CREATE TABLE "chat_app_chat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "is_group" BOOLEAN NOT NULL,
    "avatar" TEXT NOT NULL,
    "adminId" INTEGER NOT NULL,
    CONSTRAINT "chat_app_chat_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "chat_app_chat_users" (
    "chatId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("chatId", "userId"),
    CONSTRAINT "chat_app_chat_users_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chat_app_chat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "chat_app_chat_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "chat_app_messageimage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "image" TEXT NOT NULL,
    "messageId" INTEGER NOT NULL,
    CONSTRAINT "chat_app_messageimage_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "chat_app_message" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "chat_app_message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "chatId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" INTEGER NOT NULL,
    "readerId" INTEGER NOT NULL,
    CONSTRAINT "chat_app_message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chat_app_chat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "chat_app_message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "chat_app_message_readerId_fkey" FOREIGN KEY ("readerId") REFERENCES "user_app_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "chat_app_chat_adminId_key" ON "chat_app_chat"("adminId");
