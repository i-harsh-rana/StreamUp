import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getVideoComment, updateComment } from "../controllers/comment.controller.js";

const router = Router()

router.use(verifyJWT)

router.route('/:videoId').get(getVideoComment)

router.route('/add').post(addComment)

router.route('/c/:commnetId').delete(deleteComment)

router.route('/c/:commnetId').patch(updateComment)

export default router