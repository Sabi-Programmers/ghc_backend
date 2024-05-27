import express from 'express';
import {
    getReferrerTreePage,
    getMyReferrersPage,
    getTeamPerformancePage,
    getTeamGenerationPage,
} from '../controllers/network.js';

const networkRouter = express.Router();

networkRouter.get('/referrer-tree', getReferrerTreePage);
networkRouter.get('/my-referrers', getMyReferrersPage);
networkRouter.get('/team-performance', getTeamPerformancePage);
networkRouter.get('/team-generation', getTeamGenerationPage);

export default networkRouter;
