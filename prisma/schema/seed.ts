import { client } from "../../src/client/client";
import { startTunnel } from "../../src/config/db.tunnel";

async function main() {
    await startTunnel();
    await client.chat_app_chat_users.deleteMany({
        where: {
            chat_id: 38
        }
    })
    const photos = await client.chat_app_chat.delete({
        where: {
            id: 38
        }
    })
    console.log(photos)
}

main();