import express from 'express'
import {
    getOtp,
    getWithdrawalHistoryPage,
    getWithdrawalPage,
    makeWithdrawalRequest,
} from '../controllers/withdrawal.js'

const withdrawalRouter = express.Router()

withdrawalRouter.get('/', getWithdrawalPage)
withdrawalRouter.get('/history', getWithdrawalHistoryPage)
withdrawalRouter.post('/', makeWithdrawalRequest)
withdrawalRouter.post('/otp', getOtp)

export default withdrawalRouter
