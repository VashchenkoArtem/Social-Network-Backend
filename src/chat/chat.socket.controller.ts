import { AppError } from "../errors"; 
import { MessageService } from "../message/message.service";
import { MessageSocketController } from "../message/message.socket.controller";
import { ChatService } from "./chat.service";
import { ChatSocketControllerContract } from "./types/chat.contracts";


export const ChatSocketController: ChatSocketControllerContract = {
	registerHandlers(socket, socketServer){
		socket.on("joinChat", (data, ack) => {
			ChatSocketController.joinChat(socket, socketServer, data, ack)
		})
		socket.on("leaveChat", (data) => {
			ChatSocketController.leaveChat(socket, data)
		})
	},
	async joinChat(socket, socketServer, data, ack) {
		try {
			const isSocketParticipant = await ChatService.isUserChatParticipant(
				data.chatId,
				socket.data.userId,
			);

			if (isSocketParticipant) {
				await socket.join(`chat-${data.chatId}`);
				await MessageService.markAsRead(data.chatId, socket.data.userId)

				await MessageSocketController.notifyUnreadUpdate(socketServer, socket.data.userId)

				if (ack) {
					ack({ status: "ok" })
				}
			} else {
				if (ack) {
					ack({
						status: "error",
						message: "you are not chat participant",
					});
				}
			}
		} catch (error) {
			console.log(error);
			if (!ack) return;
			if (error instanceof AppError) {
				ack({
					status: "error",
					message: error.message,
				});
			}
			ack({
				status: "error",
				message: "unknown error",
			});
		}
	},
    leaveChat(socket, data){
        socket.leave(`chat-${data.chatId}`)
    }
};