import express from 'express';
import { getDashbord } from '../controllers/dashboard.js';
const dashboardRouter = express.Router();

dashboardRouter.get('', getDashbord);

export default dashboardRouter;
