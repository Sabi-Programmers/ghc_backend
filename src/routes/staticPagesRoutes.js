import express from 'express';
import { getContants } from '../services/contantsServices.js';

const staticPagesRouter = express.Router();

staticPagesRouter.get('', async (req, res) => {
    if (req.query.ref) {
        return res.redirect(`/auth/register?sponsorId=${  req.query.ref}`);
    }

    const data = {
        isAuthenticated: req.isAuthenticated(),
        path: req.path,
    };

    data.prices = await getContants();

    res.render('staticPages/home', { title: 'Home', data });
});
staticPagesRouter.get('/about', (req, res) => {
    const data = {
        isAuthenticated: req.isAuthenticated(),
        path: req.path,
    };
    res.render('staticPages/about', { title: 'About Us', data });
});
staticPagesRouter.get('/how-it-works', async (req, res) => {
    const data = {
        isAuthenticated: req.isAuthenticated(),
        path: req.path,
    };

    data.prices = await getContants();
    res.render('staticPages/how-it-works', { title: 'How it Works', data });
});
staticPagesRouter.get('/contact', (req, res) => {
    const data = {
        isAuthenticated: req.isAuthenticated(),
        path: req.path,
    };
    res.render('staticPages/contact', { title: 'Contact Us', data });
});
staticPagesRouter.get('/faq', (req, res) => {
    const data = {
        isAuthenticated: req.isAuthenticated(),
        path: req.path,
    };
    res.render('staticPages/faq', { title: 'FAQ', data });
});
staticPagesRouter.get('/testimonials', (req, res) => {
    const data = {
        isAuthenticated: req.isAuthenticated(),
        path: req.path,
    };
    res.render('staticPages/testimonials', { title: 'Testimonials', data });
});
staticPagesRouter.get('/our-products', (req, res) => {
    const data = {
        isAuthenticated: req.isAuthenticated(),
        path: req.path,
    };
    res.render('staticPages/our-products', { title: 'Our Products', data });
});
staticPagesRouter.get('/legal', (req, res) => {
    const data = {
        isAuthenticated: req.isAuthenticated(),
        path: req.path,
    };
    res.render('staticPages/terms-and-cond', { title: 'Legal', data });
});

export default staticPagesRouter;
