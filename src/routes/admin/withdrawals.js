import express from 'express'
import {
    approveWithdrawalRequest,
    getWithdrawalHistoryPage,
    getWithdrawalRequestPage,
    rejectWithdrawalRequest,
} from '../../controllers/admin/withdrawal.js'

const withdrawalRouter = express.Router()

withdrawalRouter.get('', getWithdrawalRequestPage)
withdrawalRouter.get('/history', getWithdrawalHistoryPage)
withdrawalRouter.post('/approve/:id', approveWithdrawalRequest)
withdrawalRouter.post('/reject/:id', rejectWithdrawalRequest)

export default withdrawalRouter
