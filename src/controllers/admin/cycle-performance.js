import { StatusCodes } from "http-status-codes";
import asyncWrapper from "../../middlewares/asyncWrapper.js";
import response from "../../utils/response.js";

import { calculatePagination } from "../../utils/index.js";
import database from "../../libs/prisma.js";

const getTeamPerformancePage = asyncWrapper(async (req, res) => {
  const data = {
    user: req.user,
  };

  const currentUsername = req.query.cu || "GHC";
  const pkg = req.query.pkg || "bronze";

  const query = {};
  query["first"] = currentUsername;
  query.package = pkg.toUpperCase();
  const order = {};
  order[pkg] = { currentCycle: "desc" };

  data.downlines = await database.user.findMany({
    where: {
      referrers: {
        some: query,
      },
    },
    select: {
      bronze: true,
      gold: true,
      diamond: true,
      username: true,
      isCycleLeader: true,
    },
    orderBy: order,
  });

  data.pkg = pkg;

  const getUser = async (username) =>
    await database.user.findFirst({
      where: { username },
      select: {
        bronze: true,
        gold: true,
        diamond: true,
        username: true,
        isCycleLeader: true,
        referrers: {
          where: { package: pkg.toUpperCase() },
        },
      },
    });

  data.currentUsername =
    currentUsername !== "GHC" ? await getUser(currentUsername) : null;

  data.prevUsername = data.currentUsername
    ? data.currentUsername.referrers.length >= 1
      ? data.currentUsername.referrers[0].first !== "GHC"
        ? await getUser(data.currentUsername.referrers[0].first)
        : null
      : null
    : null;

  res.render("admin/cycle-performance/team-performance", {
    title: "Team Peformance",
    data,
  });
});

export { getTeamPerformancePage };
