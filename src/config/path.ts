import path, { join } from "node:path";
export const uploadDir = path.resolve(process.cwd(), "media");
export const thumbDir = join(uploadDir, "./thumb");
export const originalDir = join(uploadDir, "./original");