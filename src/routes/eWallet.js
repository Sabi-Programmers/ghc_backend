import express from 'express';
import { fundWallet, getEWallet } from '../controllers/eWallet.js';
const eWalletRouter = express.Router();

eWalletRouter.get('', getEWallet);
eWalletRouter.get('/fund-wallet', fundWallet);

export default eWalletRouter;
