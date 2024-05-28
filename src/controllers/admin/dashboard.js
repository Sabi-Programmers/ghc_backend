import asyncWrapper from '../../middlewares/asyncWrapper.js';
import userServices from '../../services/userServices.js';

const getAdminDashboard = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
    };

    data.totalMembers = await userServices.getTotalUsers();
    data.joinedToday = await userServices.getAllUsersJoinedToday();
    data.joinedThisMonth = await userServices.getAllUsersJoinedThisMonth();
    data.joinedThisYear = await userServices.getAllUsersJoinedThisYear();
    data.totalBronzeMembers = await userServices.getAllUsersByPackage('bronze');
    data.totalGoldMembers = await userServices.getAllUsersByPackage('gold');
    data.totalDiamondMembers =
        await userServices.getAllUsersByPackage('diamond');

    res.render('admin/dashboard', {
        title: 'Admin Dashboard',
        data,
    });
});

export { getAdminDashboard };
