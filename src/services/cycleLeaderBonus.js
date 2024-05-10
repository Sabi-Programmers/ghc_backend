import database from "../libs/prisma.js";
import { getUserPackage } from "./packageServices.js";
import { getUserReferrer, getUserReferrerGen } from "./referralServices.js";

const makeUserCycleLeader = async (newUserPkg) => {
  if (newUserPkg.currentCycle === 5 && newUserPkg.usedSlots === 36) {
    return await database.user.update({
      where: { id: newUserPkg.userId },
      data: {
        isCycleLeader: true,
      },
    });
  }

  return false;
};

const cycleLeadersPayments = async (userId, pkg, username, fullName) => {
  const genealogy = await getUserReferrerGen(userId, pkg);

  const bonuses = {
    first: 0.6,
    second: 0.5,
    third: 0.4,
    forth: 0.3,
    fifth: 0.2,
    sixth: 0.1,
  };

  const query = Object.values(genealogy)
    .filter((value) => value !== null && value !== "GHC")
    .map((value) => ({ username: value }));

  const getAllGen = await database.user.findMany({
    where: {
      OR: query,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const createQuery = getAllGen
    .filter((obj) => obj.isCycleLeader)
    .map((obj) => {
      const generation = Object.keys(genealogy).find(
        (key) => genealogy[key] === obj.username
      );
      return {
        userId: obj.id,
        generation,
        amount: bonuses[generation],
        downlineName: fullName,
        downlineUsername: username,
        sponsorUsername: genealogy.first,
        package: pkg.toUpperCase(),
      };
    });

  return await database.cycleLeaderBonus.createMany({
    data: createQuery,
  });
};

export { makeUserCycleLeader, cycleLeadersPayments };
