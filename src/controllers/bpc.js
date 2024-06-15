import asyncWrapper from '../middlewares/asyncWrapper.js'
import database from '../libs/prisma.js'
import { StatusCodes } from 'http-status-codes'
import response from '../utils/response.js'

const getBpcPage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
    }
    res.render('member/business-promo-contest', {
        title: 'Business Promotion Contest',
        data,
    })
})

const submitAds = asyncWrapper(async (req, res) => {
    const { facebookAdsLink } = req.body
    const photo = req.file.filename

    await database.bpc.create({
        data: {
            facebookAdsLink,
            facebookAdsPhoto: photo,
            userId: req.user.id,
        },
    })
    return response.json(
        res,
        StatusCodes.CREATED,
        true,
        'Submitted successfully'
    )
})
const submitMeetings = asyncWrapper(async (req, res) => {
    const { facebookGroupLink, zoomMeetingLink } = req.body
    const photo = req.file.filename

    await database.bpc.create({
        data: {
            facebookGroupLink,
            zoomMeetingLink,
            whatsappGroupPhoto: photo,
            userId: req.user.id,
        },
    })
    return response.json(
        res,
        StatusCodes.CREATED,
        true,
        'Submitted successfully'
    )
})
const submitOffline = asyncWrapper(async (req, res) => {
    const { youtubeVideoLink, tiktokVideoLink } = req.body

    await database.bpc.create({
        data: {
            youtubeVideoLink,
            tiktokVideoLink,
            userId: req.user.id,
        },
    })
    return response.json(
        res,
        StatusCodes.CREATED,
        true,
        'Submitted successfully'
    )
})
const submitSignups = asyncWrapper(async (req, res) => {
    const signupUsernames = req.body.usernames

    await database.bpc.create({
        data: {
            signupUsernames,
            userId: req.user.id,
        },
    })
    return response.json(
        res,
        StatusCodes.CREATED,
        true,
        'Submitted successfully'
    )
})

export { getBpcPage, submitAds, submitMeetings, submitOffline, submitSignups }
