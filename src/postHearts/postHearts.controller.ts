import { IPostHeartsControllerContract } from './postHearts.types'
import { HeartsService } from "./postHearts.service";

export const HeartsController: IPostHeartsControllerContract = {
    getPostHearts: async (req, res) => {
        const postId = Number(req.params.postId)
        const hearts = await HeartsService.getPostHearts(postId)
        res.status(200).json(hearts)
    },

    getPostHeartStatus: async (req, res) => {
        const postId = Number(req.params.postId)
        const userId = Number(res.locals.userId)
        const isHearted = await HeartsService.getPostHeartStatus(postId, userId)

        res.status(200).json({ isHearted })
    },

    createHeart: async (req, res) => {
        try {
            const postId = Number(req.params.postId)
            const userId = Number(res.locals.userId)
            
            const newHeart = await HeartsService.createHeart(postId, userId)
            res.status(201).json(newHeart)
        } catch (error) {
            res.status(400).json("Unable to create Heart")
        }
    },

    deleteHeart: async (req, res) => {
        try {
            const postId = Number(req.params.postId)
            const userId = Number(res.locals.userId)

            if (isNaN(postId)) {
                res.status(400).json('Post ID must be a number')
                return
            }

            const deletedHeart = await HeartsService.deleteHeart(postId, userId)
            res.status(200).json(deletedHeart)
        } catch (error) {
            res.status(500).json("Internal Server Error")
        }
    }
}