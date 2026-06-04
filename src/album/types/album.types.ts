import { Prisma } from "@prisma/client";


export type Album = Prisma.profile_app_albumGetPayload<{
    include: { profile_app_albumimage: true }
}>

export type CreateAlbumInput = Prisma.profile_app_albumUncheckedCreateInput
export type UpdateAlbumInput = Prisma.profile_app_albumUpdateInput

export type Photo = Prisma.profile_app_albumimageGetPayload<{}>
export type PhotoWithoutAlbumId = Prisma.profile_app_albumimageCreateInput
// export type CreatePhotoInput = {
//     image: Photo,
//     albumId: number
// }

export type AlbumVisibilityInput = {
    albumId: number
}


export type ErrorResponse = {
    message: string;
};

export interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        email?: string;
    };
}