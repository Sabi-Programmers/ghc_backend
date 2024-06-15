import { StatusCodes } from 'http-status-codes'
import { v4 as uuidv4 } from 'uuid'
import asyncWrapper from '../middlewares/asyncWrapper.js'
import {
    getSingleProduct,
    getAllProducts,
} from '../services/productServices.js'
import { calculatePagination } from '../utils/index.js'
import response from '../utils/response.js'
import { getPaymentLink, verifyPayment } from '../libs/paymentGateway.js'
import { getContants } from '../services/contantsServices.js'
import {
    createdManyOrders,
    getTxShopOrders,
    ordersTotalAmount,
    updateOrderStatus,
} from '../services/shopOrderServices.js'

const getProductsPage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
        path: req.baseUrl,
    }

    const page = Number(req.query.page) || 1 // Current page
    const perPage = Number(req.query.limit) || 10 // Number of records per page
    const productType = req.query.t || 'all'
    const category = req.query.c || 'all'

    // await generateProduct();

    const { products, totalItem } = await getAllProducts(
        page,
        perPage,
        productType,
        category
    )

    data.products = products
    data.pagination = calculatePagination(totalItem, page, perPage)
    data.page = page
    data.perPage = perPage
    data.productType = productType
    data.category = category

    if (!req.user || req.user.role !== 'MEMBER') {
        return res.render('staticPages/shop/products', {
            title: 'Products',
            data,
        })
    }

    res.render('member/shop/products', {
        title: 'Products',
        data,
    })
})

const getSingleProductPage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
        path: req.baseUrl,
    }

    const slug = req.params.slug

    data.product = await getSingleProduct(slug)

    if (!req.user || req.user.role !== 'MEMBER') {
        return res.render('staticPages/shop/single-product', {
            title: data.product.name,
            data,
            path: req.path,
        })
    }

    res.render('member/shop/single-product', {
        title: data.product.name,
        data,
    })
})

const getCartPage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
        path: req.baseUrl,
    }

    if (!req.user || req.user.role !== 'MEMBER') {
        return res.render('staticPages/shop/cart', {
            title: 'Cart',
            data,
        })
    }

    res.render('member/shop/cart', {
        title: 'Cart',
        data,
    })
})
const getCheckoutPage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
        path: req.baseUrl,
    }

    if (!req.user || req.user.role !== 'MEMBER') {
        return res.render('staticPages/shop/checkout', {
            title: 'Checkout Order',
            data,
        })
    }

    res.render('member/shop/checkout', {
        title: 'Checkout Order',
        data,
    })
})
const getOrderCompletePage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
        path: req.baseUrl,
        status: null,
        items: [],
        isDigital: false,
    }

    const { tx_ref, transaction_id, status } = req.query
    const allOrders = await getTxShopOrders(tx_ref)

    if (status === 'successful') {
        const constant = await getContants()
        // Get all Order with tx_ref
        const transactionTotal = await ordersTotalAmount(tx_ref)

        const transaction = await verifyPayment(transaction_id)

        if (transaction.status === 'success') {
            if (
                transaction.data.currency === 'USD' &&
                transaction.data.amount === transactionTotal._sum.amount
            ) {
                await Promise.all(
                    allOrders.map(async (ord) => {
                        return await updateOrderStatus(
                            tx_ref,
                            ord.Item.productType
                        )
                    })
                )
                data.items = allOrders

                data.items.forEach((item) => {
                    if (item.Item && item.Item.productType === 'DIGITAL') {
                        data.isDigital = true
                    }
                })
                data.status = 'success'
            } else if (
                transaction.data.currency === 'NGN' &&
                transaction.data.amount / constant.usdRate ===
                    transactionTotal._sum.amount
            ) {
                await Promise.all(
                    allOrders.map(async (ord) => {
                        return await updateOrderStatus(
                            tx_ref,
                            ord.Item.productType
                        )
                    })
                )
                data.items = allOrders

                data.items.forEach((item) => {
                    if (item.Item && item.Item.productType === 'DIGITAL') {
                        data.isDigital = true
                    }
                })
                data.status = 'success'
            } else {
                await Promise.all(
                    allOrders.map(async (ord) => {
                        return await updateOrderStatus(
                            tx_ref,
                            ord.Item.productType,
                            true
                        )
                    })
                )
                data.status = 'failed'
            }
        } else {
            await Promise.all(
                allOrders.map(async (ord) => {
                    return await updateOrderStatus(
                        tx_ref,
                        ord.Item.productType,
                        true
                    )
                })
            )

            data.status = 'failed'
        }
    } else {
        await Promise.all(
            allOrders.map(async (ord) => {
                return await updateOrderStatus(
                    tx_ref,
                    ord.Item.productType,
                    true
                )
            })
        )
        data.status = 'failed'
    }

    if (!req.user || req.user.role !== 'MEMBER') {
        return res.render('staticPages/shop/order-complete', {
            title: 'Checkout Order',
            data,
        })
    }
    res.render('member/shop/order-complete', {
        title: 'Checkout Order',
        data,
    })
})

const checkoutOrder = asyncWrapper(async (req, res) => {
    const { email, fullName, phone, currency, orders, address, country, city } =
        req.body

    // get all product ordered
    let items = await Promise.all(
        orders.map(async (order) => {
            const product = await getSingleProduct(null, Number(order.id), {
                sellingPrice: true,
                id: true,
            })
            if (!product) {
                return null
            }
            return product
        })
    )

    // if any of the product doesnt exist return
    if (items.some((item) => item === null)) {
        return response.json(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            'Something Went Wrong'
        )
    }

    // Get total order Price
    function getTotalPrice(orders, products) {
        return orders.reduce((total, order) => {
            const product = products.find((p) => p.id === parseInt(order.id))
            if (product) {
                total += product.sellingPrice * order.quantity
            }
            return total
        }, 0)
    }
    const constant = await getContants()
    const totalAmount =
        currency === 'NGN'
            ? constant.usdRate * getTotalPrice(orders, items)
            : getTotalPrice(orders, items)

    // Create The Order for the different products
    const tx_ref = uuidv4()

    const outputArray = orders.map((order) => {
        const product = items.find((p) => p.id.toString() === order.id)
        const amount = product ? product.sellingPrice * order.quantity : 0

        return {
            address,
            city,
            amount,
            country,
            email,
            fullName,
            itemId: Number(order.id),
            phone,
            quantity: order.quantity,
            tx_ref,
            sellerId: null,
        }
    })

    const shopOrders = await createdManyOrders(outputArray)

    if (!shopOrders) {
        return response.json(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            'Something Went Wrong'
        )
    }

    const inputData = {
        tx_ref,
        amount: totalAmount,
        currency,
        redirect_url: process.env.BASE_URL + '/shop/order-complete',
        customer: {
            email,
            phonenumber: phone,
            name: fullName,
        },
    }

    const paymentLink = await getPaymentLink(inputData)

    if (!paymentLink || paymentLink.status !== 'success') {
        return response.json(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            'Something Went Wrong'
        )
    }

    return response.json(res, StatusCodes.OK, true, 'Okay', paymentLink)
})

export {
    getProductsPage,
    getSingleProductPage,
    getCartPage,
    getCheckoutPage,
    checkoutOrder,
    getOrderCompletePage,
}
