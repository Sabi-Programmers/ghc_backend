import database from "../libs/prisma.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import { calculatePagination } from "../utils/index.js";

const getReferrerTreePage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
  };

  const cycle = Number(req.query.page) || 1; // Current Cycle
  const perCycle = 9;

  const pkg = req.query.pkg || "bronze";

  data.referrers = await database.user.findMany({
    where: {
      referrers: {
        some: { first: req.user.username, package: pkg.toUpperCase() },
      },
    },
    select: {
      username: true,
      fullName: true,
      displayPhoto: true,
    },
    skip: (cycle - 1) * perCycle,
    take: perCycle,
    orderBy: { createdAt: "desc" },
  });

  const totalCycle = await database[pkg].findUnique({
    where: { userId: req.user.id },
  });

  data.pagination = calculatePagination(totalCycle.totalSlots, cycle, perCycle);
  data.pkg = pkg;
  res.render("member/my-network/referrer-tree", {
    title: "Referrer Cycle Tree",
    data,
  });
});

export { getReferrerTreePage };
