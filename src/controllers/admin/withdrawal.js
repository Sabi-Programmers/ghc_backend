import asyncWrapper from '../../middlewares/asyncWrapper.js'
import { getAllWithdrawalRequests } from '../../services/withdrawalWalletServices.js'
import { calculatePagination } from '../../utils/index.js'

const getWithdrawalRequestPage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
    }

    const searchQuery = req.query.q || null
    const wallet = req.query.wt || 'bronze'
    const page = Number(req.query.page) || 1 // Current page
    const perPage = Number(req.query.limit) || 10 // Number of records per page

    const { requests, totalItems } = await getAllWithdrawalRequests(
        page,
        perPage,
        wallet,
        false
    )

    data.q = searchQuery

    // console.log(requests[0].User.withdrawalWallet);
    data.requests = requests
    data.pagination = calculatePagination(totalItems, page, perPage)
    data.wallet = wallet

    res.render('admin/withdrawals/request', {
        title: 'Withdrawal Requests',
        data,
    })
})
const getWithdrawalHistoryPage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
    }

    const searchQuery = req.query.q || null
    const wallet = req.query.wt || 'bronze'
    const page = Number(req.query.page) || 1 // Current page
    const perPage = Number(req.query.limit) || 10 // Number of records per page

    const { requests, totalItems } = await getAllWithdrawalRequests(
        page,
        perPage,
        wallet,
        true
    )

    data.q = searchQuery

    // console.log(requests[0].User.withdrawalWallet);
    data.requests = requests
    data.pagination = calculatePagination(totalItems, page, perPage)
    data.wallet = wallet

    res.render('admin/withdrawals/history', {
        title: 'Withdrawal History',
        data,
    })
})

export { getWithdrawalRequestPage, getWithdrawalHistoryPage }
