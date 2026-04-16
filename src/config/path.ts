import { join } from "node:path";
export const uploadDir = join(__dirname, "../", "../", "./media");
export const thumbDir = join(uploadDir, "./thumb");
export const originalDir = join(uploadDir, "./original");