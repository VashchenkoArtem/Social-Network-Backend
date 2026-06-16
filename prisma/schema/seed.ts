import { client } from "../../src/client/client";
import { startTunnel } from "../../src/config/db.tunnel";

async function main() {
    await startTunnel();
    const photos = await client.post_app_post.findMany({
        select: {
            post_app_postimage: {
                select: {
                    id: true,
                    original_image: true
                }
            }
        }
    })
    console.log(photos)
}

main();