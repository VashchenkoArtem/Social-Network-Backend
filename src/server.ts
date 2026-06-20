import cors from "cors";
import express from "express";
import type { Express } from "express";
import { userRouter } from "./user/user.router";
import { uploadDir } from "./config";
import { tagRouter } from "./tag/tag.router";
import { albumRouter } from "./album/album.router";
import { postRouter } from "./post/post.router";
import { friendRouter } from "./friends/friends.router";
import { chatRouter } from "./chat";
import { messageRouter } from "./message";
import { likesRouter } from './postLikes/postLikes.router'
import { heartsRouter } from './postHearts/postHearts.router'
import { startTunnel } from "./config/db.tunnel";
import { getLocalIpAddress } from "./config/ip";
import { createServer } from "http";
import { SocketManager } from "./socket/socket.manager";

(BigInt.prototype as any).toJSON = function () {
    return Number(this.toString());
};

const HOST = getLocalIpAddress();
// const HOST = "localhost"
const PORT = 8000;

const app: Express = express();
export const httpServer = createServer(app)

SocketManager.initSocketServer(httpServer) 

app.use(cors());
app.use("/media/", express.static(uploadDir));
app.use(express.json());
app.use(postRouter);
app.use(friendRouter);
app.use(chatRouter);
app.use(userRouter);
app.use(albumRouter);
app.use(tagRouter);
app.use(messageRouter);
app.use(likesRouter)
app.use(heartsRouter)

async function bootstrap(){
    try {
        await startTunnel();
        httpServer.listen(PORT, "0.0.0.0" , () => {
            console.log(`Сервер запущено`);
            console.log(`http://${HOST}:${PORT}`);
        });
    }catch(error){
        console.log(error)
    }
}
bootstrap()