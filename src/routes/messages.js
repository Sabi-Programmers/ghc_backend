import express from 'express'
import {
    getMessagesPage,
    getAMessagePage,
    getAddMessagePage,
    addMessage,
} from '../controllers/messages.js'

const messagesRouter = express.Router()

messagesRouter.get('', getMessagesPage)
messagesRouter.get('/send', getAddMessagePage)
messagesRouter.post('/send', addMessage)
messagesRouter.get('/:id', getAMessagePage)

export default messagesRouter
