import { v2 as cloudinary } from "cloudinary";

cloudinary.config({ 
    cloud_name: 'dan2j6jtn', 
    api_key: '756621438859245', 
    api_secret: "qsVDhCiKJQ0x4mBoAulMIgr3RKA"
});
// Получение
// const url = cloudinary.url("public_id", {
//     transformation: [
//         {
//             quality: 123
//         }
//     ]
// })

// Upload
import path from "path";

const filePath = path.resolve(
    __dirname,
    "../../media/original/1778857597659.jpg"
);

console.log(filePath);
(async function(){
    const results = await cloudinary.uploader.upload(filePath, {
        
    })
    console.log(results)
})()