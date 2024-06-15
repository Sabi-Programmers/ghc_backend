import { StatusCodes } from 'http-status-codes'
import asyncWrapper from '../middlewares/asyncWrapper.js'
import { getContants } from '../services/contantsServices.js'
import {
    createWithdrawalRequest,
    getWithdrawalRequest,
    getWithdrawalWallet,
    minusWithdrawalWallet,
} from '../services/withdrawalWalletServices.js'
import response from '../utils/response.js'
import { generateOtpToken, verifyOtpToken } from '../services/otpServices.js'
import { sendWithdrawalOtpMail } from '../libs/nodemailer.js'

const getWithdrawalPage = asyncWrapper(async (req, res) => {
    const wallet = req.query.sw
    const data = {
        user: req.user,
        threshold: null,
        totalBalance: null,
        walletBalance: null,
        wallet: null,
    }
    // get withdrawal wallet balance
    const withdrawWallet = await getWithdrawalWallet(req.user.id)
    const { bronze, gold, diamond, salesIncome, leaderCycle } = withdrawWallet
    data.totalBalance = bronze + gold + diamond + salesIncome + leaderCycle

    if (wallet) {
        // getThreshold from constants
        const threshold = await getContants()
        data.threshold = threshold[`${wallet}Threshold`]
        data.walletBalance = withdrawWallet[wallet]
        data.wallet = wallet
    }

    res.render('member/withdrawal/withdrawal-request', {
        title: 'Request From Withdrawal',
        data,
    })
})

const makeWithdrawalRequest = asyncWrapper(async (req, res) => {
    const amount = Number(req.body.amount)
    const { wallet } = req.body
    const { token } = req.body
    const userId = req.user.id

    if (!amount || !wallet || !token) {
        return response.json(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            'All fields are required'
        )
    }

    // verify OTP
    const verifyOtp = await verifyOtpToken(token, userId)
    if (!verifyOtp.status) {
        return response.json(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            verifyOtp.message
        )
    }

    // get withdrawal wallet balance
    const withdrawWallet = await getWithdrawalWallet(userId)

    // check if user has enough funds
    if (amount > withdrawWallet[wallet]) {
        return response.json(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            'Insufficient funds'
        )
    }

    // check amount is up to minimum withdrawable amount
    const threshold = await getContants()
    const walletThreshold = threshold[`${wallet}Threshold`]

    if (walletThreshold > amount) {
        return response.json(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            'Insufficient funds'
        )
    }

    // create withdrawal request
    await createWithdrawalRequest(userId, amount, wallet)

    // remove amount from balance
    await minusWithdrawalWallet(userId, amount, wallet)

    return response.json(res, StatusCodes.OK, true, 'Request Successful')
})

const getOtp = asyncWrapper(async (req, res) => {
    const otp = await generateOtpToken(req.user.id)

    await sendWithdrawalOtpMail(req.user.fullName, otp, req.user.email)

    // generate otp
    return response.json(res, StatusCodes.OK, true, 'OTP Sent to your Mail')
})

const getWithdrawalHistoryPage = asyncWrapper(async (req, res) => {
    const wallet = req.query.sw
    const status = req.query.st
    const data = {
        user: req.user,
    }

    data.withdrawals = await getWithdrawalRequest(req.user.id, wallet, status)

    res.render('member/withdrawal/withdrawal-history', {
        title: 'Withdrawal History',
        data,
    })
})

export {
    getWithdrawalPage,
    makeWithdrawalRequest,
    getOtp,
    getWithdrawalHistoryPage,
}
