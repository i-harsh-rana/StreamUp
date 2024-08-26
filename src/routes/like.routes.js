import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(verifyJWT)

router.route('/toggle/v/:videoId').post()

router.route('/toggle/c/:commetId').post()

router.route('/toggle/t/:tweetId').post()

router.route('/videos').get()

export default router