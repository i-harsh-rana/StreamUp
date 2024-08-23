import { Router } from "express";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import {upload} from '../middlewares/multer.middleware.js'
import { deleteVideo, getVideoById, publishAVideo, toggleVideoStatus, updateVideo } from "../controllers/video.controller.js";

const router = Router()

router.use(verifyJWT)

router.route('/upload-video').post(upload.fields([
    {
     name: "video", 
     maxCount: 1   
    },
    {
        name: "thumbnail",
        maxCount: 1
    }
]), publishAVideo)


router.route("/:videoId").get(getVideoById)

router.route("/edit/:videoId").patch(updateVideo)

router.route('/delete/:videoId').delete(deleteVideo)

router.route('/toggleIsPublished/:videoId').patch(toggleVideoStatus)


export default router
