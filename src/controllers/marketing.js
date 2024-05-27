import asyncWrapper from '../middlewares/asyncWrapper.js';

const getHowToEarnWeeklyPage = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
    };
    return res.render('member/marketing/earn-weekly', {
        title: 'How to Make $100 to $500 weekly',
        data,
    });
});

export { getHowToEarnWeeklyPage };
