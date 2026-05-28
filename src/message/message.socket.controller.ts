import { MessageService } from "./message.service";
import { IMessageSocketControllerContract } from "./message.types";

export const MessageSocketController: IMessageSocketControllerContract = {
    registerHandlers (socketServer, socket) {
        socket.on("sendMessage", (data) => {
            console.log(data,' dndsad')
            this.sendMessage(socketServer, socket, data)
        })
    },

    async sendMessage(socketServer, socket, data) {
        try {
            console.log(socketServer.sockets.adapter.rooms)
            const newMessage = await MessageService.createMessage({
                ...data,
                created_at: new Date(Date.now()),
                sender_id: socket.data.userId
            })
            this.newMessage(socketServer, newMessage)
        } catch (error) {
            throw error
        }
    },

    newMessage: async (socketServer, message) => {
        try {
            socketServer.to(
                `chat-${message.chat_id}`
            ).emit(
                'newMessage',
                message
            )
        } catch (error) {
            throw error
        }
    }
}