import { ChatSocketController } from "../chat/chat.socket.controller";
import { client } from "../client/client";
import { MessageSocketController } from "../message/message.socket.controller";
import { authSocketMiddleware } from "../middlewares/auth-socket.middleware";
import { AuthenticatedSocket, ServerSocket, SocketManagerContract } from "./socket.types";
import { Server as SocketServer } from "socket.io"

export const getFollowers = async (userId: number) => {
    return client.user_app_friendship.findMany({
        where: {
            to_user_id: userId,
            status: "Accepted"
        },
        select: {
            from_user_id: true
        }
    });
};
const onlineUsers = new Set<number>();
export const SocketManager: SocketManagerContract = {
    socketServer: null,
    initSocketServer(httpServer) {
        this.socketServer = new SocketServer<ServerSocket>(httpServer, {
            cors: {
                origin: "*"
            }
        })
        this.socketServer.use(authSocketMiddleware)
        this.socketServer.on("connection", async (socket: AuthenticatedSocket) => {
            const userId = socket.data.userId;
            
            console.log("Connected", userId);
            
            socket.join(`user-${userId}`);
            
            // 1. mark online
            onlineUsers.add(userId);
            
            // 2. notify followers
            const followers = await getFollowers(userId);
            
            followers.forEach((f) => {
                this.socketServer?.to(`user-${f.from_user_id}`).emit("userOnline", {
                    userId
                });
            });
            
            socket.on("getOnlineUsers", () => {
                socket.emit("onlineUsersList", Array.from(onlineUsers));
            });
            ChatSocketController.registerHandlers(socket);

            if (this.socketServer) {
                MessageSocketController.registerHandlers(this.socketServer, socket);
            }

            socket.on("disconnect", async () => {
                console.log("Disconnected", userId);

                onlineUsers.delete(userId);

                const followers = await getFollowers(userId);

                followers.forEach((f) => {
                    this.socketServer?.to(`user-${f.from_user_id}`).emit("userOffline", {
                        userId
                    });
                });
            });
        });
    }
}