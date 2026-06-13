import { client } from "../../src/client/client";
import { startTunnel } from "../../src/config/db.tunnel";

async function main() {
    await startTunnel();
    const photos = await client.user_app_user.findMany({
    })
    console.log(photos)
}

main();