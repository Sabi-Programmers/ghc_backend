import database from '../libs/prisma.js';

const updateUserPackage = async (pkg, userId, units, prevPkgData) => {
    const data = {
        totalCycle: prevPkgData.totalCycle + Number(units),
        totalSlots: prevPkgData.totalSlots + Number(units) * 9,
    };

    // update user package current cycle
    if (prevPkgData.usedSlots === prevPkgData.totalSlots) {
        data.currentCycle = prevPkgData.currentCycle + 1;
    }

    return await database[pkg].update({
        where: { userId },
        data,
    });
};

const getUserPackage = async (userId, pkg) => await database[pkg].findFirst({ where: { userId } });

const updateUplinePackage = async (uplineData, pkg) => {
    // update used slot and currentCycle

    if (uplineData && uplineData[pkg].usedSlots < uplineData[pkg].totalSlots) {
        const data = {
            usedSlots: { increment: 1 },
        };

        const sum = uplineData[pkg].usedSlots % 9;
        if (
            sum === 8 &&
            uplineData[pkg].currentCycle < uplineData[pkg].totalCycle
        ) {
            data.currentCycle = { increment: 1 };
        }

        return await database[pkg].update({
            where: { userId: uplineData.id },
            data,
        });
    }
    return false;
};

export { getUserPackage, updateUserPackage, updateUplinePackage };
