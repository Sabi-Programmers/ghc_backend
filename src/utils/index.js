const convertToNGN = (balance, usdRate) => Number((balance * usdRate).toFixed(2));

const toTwoDecimals = (sum) => Number(sum.toFixed(2));

const excludeData = (user, keys) => Object.fromEntries(
        Object.entries(user).filter(([key]) => !keys.includes(key)),
    );

const calculatePagination = (totalItems, currentPage, pageSize) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    return {
        totalPages,
        nextPage,
        prevPage,
        currentPage,
    };
};

const generateRandomString = (length) => {
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length),
        );
    }
    return result;
};

const durations = (data) => {
    const output = {};

    switch (data) {
        case 'today':
            output.gte = new Date(new Date().setHours(0, 0, 0, 0)); // Start of today
            output.lt = new Date(new Date().setHours(23, 59, 59, 999)); // End of today
            break;

        case 'week': {
            const startOfWeek = new Date();
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of the current week (Sunday)
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6); // End of the current week (Saturday)
            endOfWeek.setHours(23, 59, 59, 999);

            output.gte = startOfWeek;
            output.lt = endOfWeek;
            break;
        }

        case 'month': {
            const startOfMonth = new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1,
            ); // Start of the current month
            startOfMonth.setHours(0, 0, 0, 0);

            const endOfMonth = new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                0,
            ); // End of the current month
            endOfMonth.setHours(23, 59, 59, 999);

            output.gte = startOfMonth;
            output.lt = endOfMonth;
            break;
        }

        case 'year': {
            const startOfYear = new Date(new Date().getFullYear(), 0, 1); // Start of the current year
            startOfYear.setHours(0, 0, 0, 0);

            const endOfYear = new Date(new Date().getFullYear() + 1, 0, 0); // End of the current year
            endOfYear.setHours(23, 59, 59, 999);

            output.gte = startOfYear;
            output.lt = endOfYear;
            break;
        }

        case 'allTime':
            output.gte = new Date(0); // Start of UNIX epoch time
            output.lt = new Date('2999-01-01'); // Far future date (maximum date in JavaScript)
            break;

        default:
            throw new Error('Invalid duration specified');
    }

    return output;
};

export {
    convertToNGN,
    excludeData,
    calculatePagination,
    generateRandomString,
    toTwoDecimals,
    durations,
};
