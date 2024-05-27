import database from '../libs/prisma.js';
import asyncWrapper from '../middlewares/asyncWrapper.js';
import { calculatePagination } from '../utils/index.js';

const getBonusWalletPage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
    };

    const page = Number(req.query.page) || 1; // Current page
    const perPage = Number(req.query.limit) || 10; // Number of records per page

    data.wallet = await database.withdrawalWalletRecord.findMany({
        where: {
            userId: req.user.id,
            NOT: [
                {
                    incomeType: 'cycle_leader',
                },
                {
                    incomeType: 'sales_income',
                },
            ],
        },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
    });

    const totalItem = await database.withdrawalWalletRecord.count({
        where: {
            userId: req.user.id,
            NOT: [
                {
                    incomeType: 'cycle_leader',
                },
                {
                    incomeType: 'sales_income',
                },
            ],
        },
    });

    data.pagination = calculatePagination(totalItem, page, perPage);
    res.render('member/withdrawal-wallet/bonus-wallet', {
        title: 'Bonus Wallet',
        data,
    });
});

const getCycleLeaderWalletPage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
    };

    const page = Number(req.query.page) || 1; // Current page
    const perPage = Number(req.query.limit) || 10; // Number of records per page

    data.wallet = await database.withdrawalWalletRecord.findMany({
        where: {
            userId: req.user.id,
            incomeType: 'cycle_leader',
        },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
    });

    const totalItem = await database.withdrawalWalletRecord.count({
        where: {
            userId: req.user.id,
            incomeType: 'cycle_leader',
        },
    });

    data.pagination = calculatePagination(totalItem, page, perPage);

    res.render('member/withdrawal-wallet/cycle-leader-wallet', {
        title: 'Cycle Leader Bonus Wallet',
        data,
    });
});

const getSalesIncomeWalletPage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
    };

    const page = Number(req.query.page) || 1; // Current page
    const perPage = Number(req.query.limit) || 10; // Number of records per page

    data.wallet = await database.withdrawalWalletRecord.findMany({
        where: {
            userId: req.user.id,
            incomeType: 'sales_income',
        },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
    });

    const totalItem = await database.withdrawalWalletRecord.count({
        where: {
            userId: req.user.id,
            incomeType: 'sales_income',
        },
    });

    data.pagination = calculatePagination(totalItem, page, perPage);

    res.render('member/withdrawal-wallet/sales-income-wallet', {
        title: 'Sales Income Wallet',
        data,
    });
});

export {
    getBonusWalletPage,
    getCycleLeaderWalletPage,
    getSalesIncomeWalletPage,
};
