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

  return await Promise.all(
    Object.entries(genealogy).map(async ([key, value], i) => {
      if (value !== null && value !== "GHC") {
        await database.user.update({
          where: {
            username: value,
            isCycleLeader: true,
          },
          data: {
            cycleLeaderBonus: {
              create: {
                downlineName: fullName,
                downlineUsername: username,
                generation: i + 1,
                sponsorUsername: genealogy.first,
                amount: bonuses[key],
                package: pkg.toUpperCase(),
              },
            },
          },
        });
      }
    })
  );
};

export { makeUserCycleLeader, cycleLeadersPayments };
