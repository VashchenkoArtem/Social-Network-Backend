import { v2 as cloudinary } from "cloudinary";

const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET_KEY;

if (!apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables are missing");
}

cloudinary.config({
    cloud_name: "depqshccq",
    api_key: apiKey,
    api_secret: apiSecret,
});
export default cloudinary;