import { StatusCodes } from 'http-status-codes'
import asyncWrapper from '../../middlewares/asyncWrapper.js'
import {
    confirmPackageOrderDelivery,
    getAllPackageOrders,
} from '../../services/packageOrderServices.js'
import { calculatePagination } from '../../utils/index.js'
import response from '../../utils/response.js'

const getUndeliveredPage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
    }

    const searchQuery = req.query.q || null
    const pkg = req.query.pkg || 'Bronze'

    const page = Number(req.query.page) || 1 // Current page
    const perPage = Number(req.query.limit) || 10 // Number of records per page

    const { orders, totalOrders } = await getAllPackageOrders(
        page,
        perPage,
        'PENDING',
        pkg,
        searchQuery
    )

    data.orders = orders
    data.q = searchQuery
    data.package = pkg

    data.pagination = calculatePagination(totalOrders, page, perPage)

    res.render('admin/product-delivery/undelivered', {
        title: 'Undelivered Product',
        data,
    })
})
const getDeliveredPage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
    }
    const searchQuery = req.query.q || null
    const pkg = req.query.pkg || 'Bronze'

    const page = Number(req.query.page) || 1 // Current page
    const perPage = Number(req.query.limit) || 10 // Number of records per page

    const { orders, totalOrders } = await getAllPackageOrders(
        page,
        perPage,
        'DELIVERED',
        pkg,
        searchQuery
    )

    data.orders = orders
    data.q = searchQuery
    data.package = pkg

    data.pagination = calculatePagination(totalOrders, page, perPage)

    res.render('admin/product-delivery/delivered', {
        title: 'Delivered Product',
        data,
    })
})

const confirmPackageOrder = asyncWrapper(async (req, res) => {
    const id = req.body.id
    if (!id) {
        return response.json(
            res,
            StatusCodes.BAD_REQUEST,
            false,
            'Id is required'
        )
    }

    await confirmPackageOrderDelivery(id)
    return response.json(
        res,
        StatusCodes.OK,
        true,
        'Package Delivery Confirmed'
    )
})

export { getDeliveredPage, getUndeliveredPage, confirmPackageOrder }
