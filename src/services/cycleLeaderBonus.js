import database from "../libs/prisma.js";

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

// const makeUplineCycleLeader = async (uplineNewP)=>{

// }

export { makeUserCycleLeader };
