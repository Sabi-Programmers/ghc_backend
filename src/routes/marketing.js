import express from 'express';
import { getHowToEarnWeeklyPage } from '../controllers/marketing.js';

const marketingRouter = express.Router();

marketingRouter.get('/how-to-earn-weekly', getHowToEarnWeeklyPage);

export default marketingRouter;
