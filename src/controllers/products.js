import asyncWrapper from '../middlewares/asyncWrapper.js';
import {
    generateProduct,
    getAllProducts,
} from '../services/productServices.js';
import { calculatePagination } from '../utils/index.js';

const getProductsPage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
    };

    const page = Number(req.query.page) || 1; // Current page
    const perPage = Number(req.query.limit) || 10; // Number of records per page
    const productType = req.query.t || 'all';
    const category = req.query.c || 'all';

    // await generateProduct();

    const { products, totalItem } = await getAllProducts(
        page,
        perPage,
        productType,
        category,
    );

    data.products = products;
    data.pagination = calculatePagination(totalItem, page, perPage);
    data.page = page;
    data.perPage = perPage;
    data.productType = productType;
    data.category = category;

    res.render('member/shop/products', {
        title: 'Products',
        data,
    });
});

export { getProductsPage };
