import database from '../libs/prisma.js';
import asyncWrapper from '../middlewares/asyncWrapper.js';
import { calculatePagination } from '../utils/index.js';

const getReferrerTreePage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
    };

    const cycle = Number(req.query.page) || 1; // Current Cycle
    const perCycle = 9;

    const pkg = req.query.pkg || 'bronze';

    data.referrers = await database.user.findMany({
        where: {
            referrers: {
                some: { first: req.user.username, package: pkg.toUpperCase() },
            },
        },
        select: {
            username: true,
            fullName: true,
            displayPhoto: true,
        },
        skip: (cycle - 1) * perCycle,
        take: perCycle,
        orderBy: { createdAt: 'desc' },
    });

    const totalCycle = await database[pkg].findUnique({
        where: { userId: req.user.id },
    });

    data.pagination = calculatePagination(
        totalCycle.totalSlots,
        cycle,
        perCycle,
    );
    data.pkg = pkg;
    res.render('member/my-network/referrer-tree', {
        title: 'Referrer Cycle Tree',
        data,
    });
});

const getMyReferrersPage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
    };

    const page = Number(req.query.page) || 1; // Current page
    const perPage = Number(req.query.limit) || 10; // Number of records per page

    data.downlines = await database.user.findMany({
        where: {
            sponsorId: req.user.id,
        },
        include: { bronze: true, gold: true, diamond: true },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
    });

    const totalItem = await database.user.count({
        where: { sponsorId: req.user.id },
    });

    data.pagination = calculatePagination(totalItem, page, perPage);

    res.render('member/my-network/my-referrers', {
        title: 'My Referrers',
        data,
    });
});
const getTeamPerformancePage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
    };

    const username = req.user.username;
    const pkg = req.query.pkg || 'bronze';

    res.render('member/my-network/team-performance', {
        title: 'Team Performance',
        data,
    });
});
const getTeamGenerationPage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
    };

    const page = Number(req.query.page) || 1; // Current page
    const perPage = Number(req.query.limit) || 10; // Number of records per page
    const pkg = req.query.pkg || 'bronze';
    const gen = req.query.gen || 'first';

    const query = {};
    query[`${gen}`] = req.user.username;
    query['package'] = pkg.toUpperCase();

    data.downlines = await database.user.findMany({
        where: {
            referrers: {
                some: query,
            },
        },
        include: { bronze: true, gold: true, diamond: true },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
    });

    const totalItem = await database.user.count({
        where: {
            referrers: { some: query },
        },
    });

    data.filter = {
        pkg,
        gen,
    };

    data.pagination = calculatePagination(totalItem, page, perPage);

    res.render('member/my-network/team-generation', {
        title: 'Team Performance',
        data,
    });
});

export {
    getReferrerTreePage,
    getMyReferrersPage,
    getTeamPerformancePage,
    getTeamGenerationPage,
};
