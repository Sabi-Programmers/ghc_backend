import { StatusCodes } from 'http-status-codes'
import asyncWrapper from '../../middlewares/asyncWrapper.js'
import userServices from '../../services/userServices.js'
import response from '../../utils/response.js'
import {
    createMessage,
    delMessage,
    getMessages,
    getSingleMessage,
} from '../../services/messageServices.js'
import { calculatePagination } from '../../utils/index.js'

const getAddMessagePage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
        member: null,
    }

    const member = req.query.member

    if (member) {
        data.member = await userServices.getSingleUser(member)
    }

    res.render('admin/messages/add-message', {
        title: 'Send Message',
        data,
    })
})

const sendMessage = asyncWrapper(async (req, res) => {
    const { title, narration, userId } = req.body
    if (!title || !narration || !userId) {
        return response.json(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            'UserId, Title or Narration is required'
        )
    }

    await createMessage(title, narration, 'ADMIN', userId)
    return response.json(res, StatusCodes.CREATED, true, 'Message Sent')
})

const getUserMessagePage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
        member: null,
    }

    const page = Number(req.query.page) || 1
    const perPage = Number(req.query.limit) || 10

    data.member = await userServices.getSingleUser(req.params.member)

    const { messages, totalItems } = await getMessages(
        page,
        perPage,
        null,
        data.member.id
    )

    data.messages = messages
    data.pagination = calculatePagination(totalItems, page, perPage)

    return res.render('admin/messages/user-messages', {
        title: data.member.username + "'s Messages",
        data,
    })
})
const getMessagesPage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
        member: null,
    }

    const page = Number(req.query.page) || 1
    const perPage = Number(req.query.limit) || 10
    const memberId = Number(req.query.user) || null
    const type = req.query.t || 'received'

    const { messages, totalItems } = await getMessages(
        page,
        perPage,
        type,
        memberId
    )

    if (memberId) {
        data.member = await userServices.getSingleUser(memberId)
    }

    data.type = type
    data.messages = messages
    data.pagination = calculatePagination(totalItems, page, perPage)

    return res.render('admin/messages/messages', {
        title: 'Messages',
        data,
    })
})

const getAMessagePage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
    }

    const member = await userServices.getSingleUser(req.params.member)
    data.message = await getSingleMessage(
        member.id,
        req.params.id,
        req.user.role
    )
    data.member = member

    return res.render('admin/messages/single-message', {
        title: data.message.title,
        data,
    })
})

const deleteMessage = asyncWrapper(async (req, res) => {
    const messageId = req.body.id
    if (!messageId) {
        return response.json(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            'ID is missing'
        )
    }
    await delMessage(messageId)
    return response.json(res, StatusCodes.OK, true, 'Message Deleted')
})

export {
    getAddMessagePage,
    sendMessage,
    getMessagesPage,
    getAMessagePage,
    getUserMessagePage,
    deleteMessage,
}
