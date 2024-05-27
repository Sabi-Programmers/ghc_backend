import express from 'express';
import {
    buyPackages,
    getPackages,
    completePackageOrder,
    getSuccessPage,
    getProductDeliveryPage,
} from '../controllers/packages.js';
const packagesRouter = express.Router();

packagesRouter.get('/', getPackages);
packagesRouter.get('/complete-order', completePackageOrder);
packagesRouter.get('/order-successful', getSuccessPage);
packagesRouter.post('/', buyPackages);
packagesRouter.get('/product-delivery', getProductDeliveryPage);

export default packagesRouter;
