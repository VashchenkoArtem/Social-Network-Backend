import { client } from "../../src/client/client";

async function main() {
    await client.post_app_post.delete({
        where: {
            id: BigInt(2)
        }
        // data: {
        //     title: "New post",
        //     content: "Some content for post",
        //     topic: "Nature",
        //     author_id: 2,
        //     created_at: new Date(Date.now())
        // }
    });
}

main();