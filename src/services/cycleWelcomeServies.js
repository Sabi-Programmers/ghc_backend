import database from "../libs/prisma.js";

const updateUserCycleWelcomeBonus = async (
  userId,
  pkg,
  userPkg,
  newPkgData,
  constants
) => {
  if (userPkg.currentCycle < newPkgData.currentCycle) {
    return await database.cycleWelcomeBonus.create({
      data: {
        package: pkg.toUpperCase(),
        cycle: newPkgData.currentCycle,
        amount: constants[pkg + "WelcomeBonus"],
        userId,
      },
    });
  }
  return false;
};

const updateUplineCycleWelcomeBonus = async (
  uplineData,
  updatedUplinePkgData,
  pkg,
  constants
) => {
  if (uplineData[pkg].currentCycle < updatedUplinePkgData.currentCycle) {
    return database.cycleWelcomeBonus.create({
      data: {
        package: pkg.toUpperCase(),
        cycle: updatedUplinePkgData.currentCycle,
        amount: constants[pkg + "WelcomeBonus"],
        userId: uplineData.id,
      },
    });
  }
  return false;
};

const updatedUplineCompBonus = async () => {
  return false;
};

export { updateUserCycleWelcomeBonus, updateUplineCycleWelcomeBonus };
