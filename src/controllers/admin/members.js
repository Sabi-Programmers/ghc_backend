import { StatusCodes } from 'http-status-codes'
import asyncWrapper from '../../middlewares/asyncWrapper.js'
import { getContants } from '../../services/contantsServices.js'
import { allPackageOrdered } from '../../services/packageOrderServices.js'
import userServices from '../../services/userServices.js'
import { calculatePagination, toTwoDecimals } from '../../utils/index.js'
import response from '../../utils/response.js'
import {
    sendBlockedMemberMail,
    sendUnblockedMemberMail,
} from '../../libs/nodemailer.js'

const getMembers = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
    }

    const searchQuery = req.query.q || null
    const membersStatus = req.query.st || 'all'

    const page = Number(req.query.page) || 1 // Current page
    const perPage = Number(req.query.limit) || 10 // Number of records per page

    const { members, totalMembers } = await userServices.getAllUsers({
        page,
        perPage,
        membersStatus,
        searchQuery,
    })

    data.q = searchQuery
    data.st = membersStatus
    data.members = members
    data.pagination = calculatePagination(totalMembers, page, perPage)

    res.render('admin/members/members', {
        title: 'All Members',
        data,
    })
})

const getMembersOrders = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
    }

    const prices = await getContants()

    const page = Number(req.query.page) || 1 // Current page
    const perPage = Number(req.query.limit) || 10 // Number of records per page
    const duration = req.query.du || 'today'

    const { orders, totalItem, bronze, gold, diamond } =
        await allPackageOrdered({
            page,
            perPage,
            duration,
        })
    data.orders = orders

    data.bronze = toTwoDecimals(bronze * prices.bronze).toLocaleString()
    data.gold = toTwoDecimals(gold * prices.gold).toLocaleString()
    data.diamond = toTwoDecimals(diamond * prices.diamond).toLocaleString()

    data.total = toTwoDecimals(
        Number(data.bronze) + Number(data.gold) + Number(data.diamond)
    ).toLocaleString()

    data.pagination = calculatePagination(totalItem, page, perPage)
    data.du = duration

    res.render('admin/members/orders', {
        title: 'All Orders',
        data,
    })
})

const getBlockMemberPage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
        member: null,
    }
    const member = req.query.member
    if (member) {
        data.member = await userServices.getUserForBlocking(member)
    }

    res.render('admin/member-manager/block-member', {
        title: 'Block member',
        data,
    })
})
const blockMember = asyncWrapper(async (req, res) => {
    const { username, fullName, reason } = req.body

    if (!username || !fullName || !reason) {
        return response.json(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            'Field Missing or Invalid'
        )
    }

    const member = await userServices.blockUser(username, reason)

    try {
        await sendBlockedMemberMail(
            member.fullName,
            member.email,
            member.blockedReason
        )
    } catch (error) {}

    return response.json(res, StatusCodes.OK, true, 'Member account blocked')
})
const unblockMember = asyncWrapper(async (req, res) => {
    const { memberId } = req.body

    if (!memberId) {
        return response.json(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            'Field Missing or Invalid'
        )
    }

    const member = await userServices.unblockUser(memberId)

    try {
        await sendUnblockedMemberMail(member.fullName, member.email)
    } catch (error) {}

    return response.json(res, StatusCodes.OK, true, 'Member account unblocked')
})
const getBlockedMembersPage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
    }

    const searchQuery = req.query.q || null

    const page = Number(req.query.page) || 1 // Current page
    const perPage = Number(req.query.limit) || 10 // Number of records per page
    const { members, totalItem } = await userServices.getAllBlockedUsers(
        page,
        perPage,
        searchQuery
    )
    data.members = members

    data.q = searchQuery

    data.pagination = calculatePagination(totalItem, page, perPage)

    res.render('admin/member-manager/blocked-members', {
        title: 'Blocked members',
        data,
    })
})
const getRollBackFundsPage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
        member: null,
    }

    const wallet = req.query.wt || null

    const member = req.query.member
    if (member) {
        data.member = await userServices.getUserForRollBack(member)
    }

    data.wallet = wallet

    res.render('admin/member-manager/rollback-funds', {
        title: 'Roll Back Funds',
        data,
    })
})
const rollBackFunds = asyncWrapper(async (req, res) => {
    const { username, wallet, amount } = req.body

    if (!username || !wallet || !amount) {
        return response.json(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            'Field Missing or Invalid'
        )
    }

    // get current balance and check if amount is less than current balance
    const member = await userServices.getUserForRollBack(username)

    const balance = member.withdrawalWallet[wallet]

    if (Number(amount) > balance) {
        return response.json(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            'Amount Greater than Member Balance'
        )
    }
    // substract the amount from the current balance

    const newBalance = Number((balance - Number(amount)).toFixed(2))

    await userServices.updateUserForRollBack(username, wallet, newBalance)
    return response.json(res, StatusCodes.OK, true, 'Funds Rolled Back')
})
const searchMember = asyncWrapper(async (req, res) => {
    const username = req.query.username
    if (!username) {
        return response.json(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            'Username Query Missing'
        )
    }
    const member = await userServices.searchUsers(username)
    return response.json(res, StatusCodes.OK, true, 'Users Found', member)
})
export {
    getMembers,
    getMembersOrders,
    getBlockMemberPage,
    getBlockedMembersPage,
    getRollBackFundsPage,
    searchMember,
    rollBackFunds,
    blockMember,
    unblockMember,
}
