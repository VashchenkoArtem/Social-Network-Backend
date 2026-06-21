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
            const members = await ChatService.getChatParticipants(data.chat_id)
            members?.chat_app_chat_users.forEach((participant) => {
                if (Number(participant.user_app_user.id.toString()) !== socket.data.userId){
                                          
                }
            })
            await MessageService.createMessage({
                text: data.text,
                chat_id: data.chat_id,
                created_at: new Date(Date.now()),
                sender_id: socket.data.userId,
                photos: uploadedPhotos
            })
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
    }
}