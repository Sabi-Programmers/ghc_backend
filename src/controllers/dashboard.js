import asyncWrapper from '../middlewares/asyncWrapper.js';
import { getEwallet } from '../services/eWalletServices.js';
import userServices from '../services/userServices.js';

const getDashbord = asyncWrapper(async (req, res) => {
    const data = {
        user: null,
    };
    if (req.user.hasFunded) {
        data.user = await userServices.getUserDashboardDetails(req.user.id);
        data.withdrawalWallet = {
            total:
                data.user.withdrawalWallet.bronze +
                data.user.withdrawalWallet.gold +
                data.user.withdrawalWallet.diamond +
                data.user.withdrawalWallet.salesIncome +
                data.user.withdrawalWallet.leaderCycle,
            gold: data.user.withdrawalWallet.gold,
            diamond: data.user.withdrawalWallet.diamond,
            bronze: data.user.withdrawalWallet.bronze,
            cycleLeader: data.user.withdrawalWallet.leaderCycle,
            salesIncome: data.user.withdrawalWallet.salesIncome,
        };
        data.referrers = {
            referrers:
                data.user.bronze.usedSlots +
                data.user.gold.usedSlots +
                data.user.diamond.usedSlots,
            bronze: data.user.bronze.usedSlots,
            gold: data.user.gold.usedSlots,
            diamond: data.user.diamond.usedSlots,
        };

        data.referrersIncome = {
            total: 0,
            bronze: 0,
            gold: 0,
            diamond: 0,
        };
        data.cycleWelcomeBonus = {
            total: 0,
            bronze: 0,
            gold: 0,
            diamond: 0,
        };
        data.completionBonus = {
            total: 0,
            bronze: 0,
            gold: 0,
            diamond: 0,
        };

        const calculateData = (input, output) => {
            input.forEach((item) => {
                output.total += item.amount;
                switch (item.package) {
                    case 'BRONZE':
                        output.bronze += item.amount;
                        break;
                    case 'GOLD':
                        output.gold += item.amount;
                        break;
                    case 'DIAMOND':
                        output.diamond += item.amount;
                        break;
                    default:
                        break;
                }
            });
        };

        calculateData(data.user.referrerIncome, data.referrersIncome);
        calculateData(data.user.cycleWelcomeBonus, data.cycleWelcomeBonus);
        calculateData(data.user.completionBonus, data.completionBonus);
    } else {
        data.user = req.user;
        data.eWallet = await getEwallet(req.user.id);
    }

    res.render('member/dashboard', { title: 'Dashboard', data });
});

export { getDashbord };
