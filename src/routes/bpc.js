import express from 'express'
import {
    getBpcPage,
    submitAds,
    submitMeetings,
    submitOffline,
    submitSignups,
} from '../controllers/bpc.js'
import { uploadImage } from '../middlewares/upload.js'

const bpcRouter = express.Router()

bpcRouter.get('/', getBpcPage)
bpcRouter.post('/ads', uploadImage.single('photo'), submitAds)
bpcRouter.post('/meetings', uploadImage.single('photo'), submitMeetings)
bpcRouter.post('/offline', submitOffline)
bpcRouter.post('/signups', submitSignups)

export default bpcRouter
