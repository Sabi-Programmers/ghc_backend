import express from 'express'
import { uploadImage, uploadPDF } from '../../middlewares/upload.js'
import {
    getAddProductPage,
    addProduct,
    addProductFile,
    getPhysicalOrderPage,
    getDigitalOrderPage,
    confirmProductDelivery,
} from '../../controllers/admin/shop.js'

const shopRouter = express.Router()

shopRouter.get('/add-product', getAddProductPage)
shopRouter.get('/orders/digital', getDigitalOrderPage)
shopRouter.get('/orders/physical', getPhysicalOrderPage)
shopRouter.post('/orders/physical', confirmProductDelivery)
shopRouter.post('/add-product', uploadImage.single('photo'), addProduct)
shopRouter.post('/add-product/file', uploadPDF.single('file'), addProductFile)

export default shopRouter
