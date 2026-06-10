import { UserService } from "./user.service"
import { UserSocketControllerContract } from "./user.types"

export const UserSocketController: UserSocketControllerContract = {
    registerHandlers(socket, socketServer) {
        socket.join(`user_${socket.data.userId}`)
        
        socket.on("getUsersOnline", (data, ack) => {
            if (socketServer){
                this.getUsersOnline(socketServer, data, ack)
            }else {
                console.log("socket server is null")
            }
        })        
        socket.on('disconnect', () => {
            socket.leave(`user_${socket.data.userId}`)
        })
    },
    async getUsersOnline(socketServer, data, ack) {
        const onlineUsersIds = data.userIds.filter((userId) => {
            return this.isUserOnline(userId, socketServer)
        })

        if (ack){
            ack({onlineUserIds: onlineUsersIds})
        }
    },
    async isUserOnline(userId, socketServer){
        const room = socketServer.sockets.adapter.rooms.get(`user_${userId}`)
        if (!room){
            return false
        }
        return room && room.size > 0
    }
}