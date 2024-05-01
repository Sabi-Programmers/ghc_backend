import database from "../libs/prisma.js";

const updateUplineUnclaimedBonus = async (sponsorId, pkg, prices) => {
  const packageBonus = prices[`${pkg}RefBonus`];
  const data = {};

  data[pkg] = { increment: packageBonus };
  data[`${pkg}LostCount`] = { increment: 1 };

  return await database.unclaimedRewards.update({
    where: { userId: sponsorId },
    data,
  });
};

export { updateUplineUnclaimedBonus };
