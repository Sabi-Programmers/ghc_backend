import express from 'express';
import { getBpcPage } from '../controllers/bpc.js';

const bpcRouter = express.Router();

bpcRouter.get('/', getBpcPage);

export default bpcRouter;
