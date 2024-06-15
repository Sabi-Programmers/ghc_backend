import express from 'express'
import {
    confirmPackageOrder,
    getDeliveredPage,
    getUndeliveredPage,
} from '../../controllers/admin/product-delivery.js'

const productDeliveryRouter = express.Router()

productDeliveryRouter.get('/undelivered', getUndeliveredPage)
productDeliveryRouter.post('/undelivered', confirmPackageOrder)
productDeliveryRouter.get('/delivered', getDeliveredPage)

export default productDeliveryRouter
