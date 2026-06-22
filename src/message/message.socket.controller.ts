import sharp from "sharp";
import streamifier from "streamifier";
import { IMessageSocketControllerContract } from "./message.types";
import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { MessageService } from "./message.service";
import { ChatService } from "../chat/chat.service";

export const MessageSocketController: IMessageSocketControllerContract = {
    registerHandlers (socketServer, socket) {
        socket.on("sendMessage", (data) => {
            this.sendMessage(socketServer, socket, data)
        })
    },

    async sendMessage(socketServer, socket, data) {
        try {

            const uploadedPhotos = await Promise.all(
                (data.photos || []).map(async (photo) => {

                    const cleanBase64 = photo.replace(
                        /^data:image\/\w+;base64,/,
                        ""
                    );

                    const buffer = Buffer.from(
                        cleanBase64,
                        "base64"
                    );

                    const resizedBuffer = await sharp(buffer)
                        .resize({
                            width: 1200,
                            withoutEnlargement: true,
                        })
                        .flatten({ background: "#ffffff" })
                        .jpeg({ quality: 80 })
                        .toBuffer();

                    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            {
                                folder: "media/chat_app/message_images",
                            },
                            (error, result) => {
                                if (error) return reject(error);
                                if (result)resolve(result);
                            }
                        );
                        streamifier
                            .createReadStream(resizedBuffer)
                            .pipe(stream);
                    });

                    return result.public_id;
                })
            );

            const tempMessage = {
                id: BigInt(Date.now()),
                created_at: new Date(),
                text: data.text,
                chat_id: BigInt(data.chat_id),
                sender_id: BigInt(socket.data.userId),
                user_app_user: {
                    id: BigInt(Date.now()),
                    profile_app_profile: {
                        id: BigInt(Date.now()),
                        avatar: data.avatar,
                        pseudonym: data.pseudonym,
                    },
                },
                chat_app_messageimage: uploadedPhotos.map((photo: string) => ({
                    id: Date.now(),
                    image: photo,
                })),
            };
            this.newMessage(socketServer, tempMessage);

            await MessageService.createMessage({
                text: data.text,
                chat_id: data.chat_id,
                created_at: new Date(Date.now()),
                sender_id: socket.data.userId,
                photos: uploadedPhotos
            })

            const members = await ChatService.getChatParticipants(data.chat_id)
            const recipientIds = (members?.chat_app_chat_users ?? [])
                .map((participant: { user_app_user: { id: bigint | number } }) =>
                    Number(participant.user_app_user.id.toString())
                )
                .filter((participantId: number) => participantId !== socket.data.userId)

            await Promise.all(
                recipientIds.map(async (recipientId: number) => {
                    const isViewingChat = this.isUserInChatRoom(
                        socketServer,
                        recipientId,
                        data.chat_id
                    )

                    if (isViewingChat) {
                        await MessageService.markAsRead(data.chat_id, recipientId)

                        socketServer.to(`chat-${data.chat_id}`).emit("messagesRead", {
                            chatId: data.chat_id,
                            readerId: recipientId,
                        })
                    }

                    await this.notifyUnreadUpdate(socketServer, recipientId)
                })
            )
        } catch (error) {
            throw error;
        }
    },

    newMessage: async (socketServer, message) => {
        try {
            socketServer.to(
                `chat-${message.chat_id.toString()}`
            ).emit(
                'newMessage',
                message
            )
            
        } catch (error) {
            throw error
        }
    },

    notifyUnreadUpdate: async (socketServer, userId) => {
        try {
            const [summary, byChat] = await Promise.all([
                MessageService.getUnreadSummary(userId),
                MessageService.getAllUnreadChatMessages(userId)
            ])

            socketServer.to(`user_${userId}`).emit('unreadCountUpdate', {
                summary,
                byChat
            })
        } catch (error) {
            throw error
        }
    },

    isUserInChatRoom: (socketServer, userId, chatId) => {
        const room = socketServer.sockets.adapter.rooms.get(`chat-${chatId}`)
        if (!room) return false

        for (const socketId of room) {
            const memberSocket = socketServer.sockets.sockets.get(socketId)
            if (memberSocket?.data.userId === userId) {
                return true
            }
        }

        return false
    }
}