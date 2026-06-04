import { client } from "../../src/client/client";
import { startTunnel } from "../../src/config/db.tunnel";

async function main() {
    await startTunnel();
    const photos = await client.profile_app_profile.update({
        where: {
            id: BigInt(22)
        },
        data: {
            pseudonym: "Vashchenko Artem"
        }
    });
    console.log(photos)
}

main();