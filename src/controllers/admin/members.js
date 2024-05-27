import asyncWrapper from '../../middlewares/asyncWrapper.js';
import { getContants } from '../../services/contantsServices.js';
import {
    allPackageOrdered,
    totalPackageOrdered,
} from '../../services/packageOrderServices.js';
import userServices from '../../services/userServices.js';
import { calculatePagination, toTwoDecimals } from '../../utils/index.js';

const getMembers = asyncWrapper(async (req, res) => {
    let data = {
        user: req.user,
    };

    const searchQuery = req.query.q || null;
    const membersStatus = req.query.st || 'all';

    const page = Number(req.query.page) || 1; // Current page
    const perPage = Number(req.query.limit) || 10; // Number of records per page

    const { members, totalMembers } = await userServices.getAllUsers({
        page,
        perPage,
        membersStatus,
        searchQuery,
    });

    data.q = searchQuery;
    data.st = membersStatus;
    data.members = members;
    data.pagination = calculatePagination(totalMembers, page, perPage);

    res.render('admin/members/members', {
        title: 'All Members',
        data,
    });
});

const getMembersOrders = asyncWrapper(async (req, res) => {
    let data = {
        user: req.user,
    };

    const prices = await getContants();

    const page = Number(req.query.page) || 1; // Current page
    const perPage = Number(req.query.limit) || 10; // Number of records per page
    const duration = req.query.du || 'today';

    const { orders, totalItem, bronze, gold, diamond } =
        await allPackageOrdered({
            page,
            perPage,
            duration,
        });
    data.orders = orders;

    data.bronze = toTwoDecimals(bronze * prices.bronze).toLocaleString();
    data.gold = toTwoDecimals(gold * prices.gold).toLocaleString();
    data.diamond = toTwoDecimals(diamond * prices.diamond).toLocaleString();

    data.total = toTwoDecimals(
        Number(data.bronze) + Number(data.gold) + Number(data.diamond),
    ).toLocaleString();

    data.pagination = calculatePagination(totalItem, page, perPage);
    data.du = duration;

    res.render('admin/members/orders', {
        title: 'All Orders',
        data,
    });
});

export { getMembers, getMembersOrders };
