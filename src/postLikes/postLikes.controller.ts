import { IPostLikesControllerContract } from './postLikes.types'
import { LikesService } from "./postLikes.service";

export const LikesController: IPostLikesControllerContract = {
    getPostLikesCount: async (req, res) => {
        const postId = Number(req.params.postId)
        const likesCount = await LikesService.getPostLikesCount(postId)
        res.status(200).json(likesCount)
    },

    getPostLikeStatus: async (req, res) => {
        const postId = Number(req.params.postId)
        const userId = Number(res.locals.userId)
        
        const isLiked = await LikesService.getPostLikeStatus(postId, userId)
        res.status(200).json({ isLiked })
    },

    createLike: async (req, res) => {
        try {
            const postId = Number(req.params.postId)
            const userId = Number(res.locals.userId)
            
            const newLike = await LikesService.createLike(postId, userId)
            res.status(201).json(newLike)
        } catch (error) {
            res.status(400).json("Unable to create like")
        }
    },

    deleteLike: async (req, res) => {
        try {
            const postId = Number(req.params.postId)
            const userId = Number(res.locals.userId)

            if (isNaN(postId)) {
                res.status(400).json('Post ID must be a number')
                return
            }

            const deletedLike = await LikesService.deleteLike(postId, userId)
            res.status(200).json(deletedLike)
        } catch (error) {
            res.status(500).json("Internal Server Error")
        }
    }
}