import express from 'express'
import {
    getAMessagePage,
    getAddMessagePage,
    getMessagesPage,
    sendMessage,
    getUserMessagePage,
    deleteMessage,
} from '../../controllers/admin/messages.js'
const messagesRouter = express.Router()

messagesRouter.get('', getMessagesPage)
messagesRouter.get('/send', getAddMessagePage)
messagesRouter.post('/send', sendMessage)
messagesRouter.get('/:member', getUserMessagePage)
messagesRouter.get('/:member/:id', getAMessagePage)
messagesRouter.post('/:member/:id/delete', deleteMessage)

export default messagesRouter
