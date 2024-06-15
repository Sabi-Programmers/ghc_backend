import express from 'express'
import {
    getBonusWalletPage,
    getCycleLeaderWalletPage,
    getSalesIncomeWalletPage,
} from '../controllers/withdrawal-wallets.js'

const withdrawalWalletsRouter = express.Router()

withdrawalWalletsRouter.get('/bonus-wallet', getBonusWalletPage)
withdrawalWalletsRouter.get('/cycle-leader-wallet', getCycleLeaderWalletPage)
withdrawalWalletsRouter.get('/sales-income-wallet', getSalesIncomeWalletPage)

export default withdrawalWalletsRouter
