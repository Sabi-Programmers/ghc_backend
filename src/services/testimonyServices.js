import database from "../libs/prisma.js";
import { getContants } from "./contantsServices.js";

const getUserForTestimonyBonus = async (userId) =>
  await database.testimonyBonus.findUnique({ where: { userId } });

const createTestimonyRequest = async (
  userId,
  pkg,
  facebookLink,
  tiktokLink,
  youtubeLink,
  completedCycles,
  lastPaidCycles,
  message
) =>
  await database.testimonyRecords.create({
    data: {
      userId,
      package: pkg.toUpperCase(),
      facebookLink,
      tiktokLink,
      youtubeLink,
      completedCycles,
      lastPaidCycles,
      message,
    },
  });

const getAllUserTestimony = async (userId, perPage, page) => {
  const testimonies = await database.testimonyRecords.findMany({
    where: { userId: Number(userId) },
    include: { user: { include: { bronze: true, gold: true, diamond: true } } },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { createdAt: "desc" },
  });
  const totalItem = await database.testimonyRecords.count({
    where: { userId: Number(userId) },
  });

  return { testimonies, totalItem };
};

const getAllTestimony = async (page, perPage, searchQuery, status) => {
  const whereClause = { status };
  if (searchQuery) {
    const searchConditions = [
      { user: { username: { contains: searchQuery, mode: "insensitive" } } },
      { user: { fullName: { contains: searchQuery, mode: "insensitive" } } },
    ];

    if (whereClause.OR) {
      whereClause.AND = { OR: searchConditions };
    } else {
      whereClause.OR = searchConditions;
    }
  }
  const testimonies = await database.testimonyRecords.findMany({
    where: whereClause,
    include: { user: { include: { bronze: true, gold: true, diamond: true } } },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { createdAt: "desc" },
  });
  const totalItem = await database.testimonyRecords.count({
    where: whereClause,
  });

  return { testimonies, totalItem };
};

const rejectUserTestimony = async (userId, id, feedbackMessage) => {
  return await database.testimonyRecords.update({
    where: {
      id: Number(id),
      userId: Number(userId),
    },
    data: {
      feedbackMessage,
      status: "DENIED",
    },
  });
};

const acceptUserTestimony = async (userId, id, publish = false) => {
  // Update testimony record status to "APPRoved"
  const tm = await database.testimonyRecords.update({
    where: {
      id: Number(id),
      userId: Number(userId),
    },
    data: {
      status: "APPROVED",
      publish,
    },
  });

  // Get constants
  const constant = await getContants();

  // Retrieve user details
  const user = await database.user.findUnique({
    where: {
      id: Number(userId),
    },
    select: {
      id: true,
      withdrawalWallet: true,
      testimonyBonus: true,
      fullName: true,
      username: true,
    },
  });

  // Calculate bonus amount and update testimony bonus
  const count = tm.completedCycles - tm.lastPaidCycles;
  const testimonyBonusData = {};
  const pkg = tm.package.toLowerCase();
  const amount = constant[pkg + "TestimonyBonus"];
  const totalAmount = amount * count + user.testimonyBonus[pkg];
  testimonyBonusData[pkg] = parseFloat(totalAmount.toFixed(2));
  testimonyBonusData[pkg + "Count"] =
    count + user.testimonyBonus[pkg + "Count"];

  await database.testimonyBonus.update({
    where: {
      userId: Number(userId),
    },
    data: testimonyBonusData,
  });

  // Create withdrawal wallet records without using a loop
  const withdrawalWalletRecords = Array.from({ length: count }, (_, i) => ({
    incomeType: "testimony",
    amount: amount,
    name: user.fullName,
    username: user.username,
    userId: user.id,
    cycle: user.testimonyBonus[pkg + "Count"] + i,
    package: pkg.toUpperCase(),
  }));

  await Promise.all(
    withdrawalWalletRecords.map((record) =>
      database.withdrawalWalletRecord.create({ data: record })
    )
  );

  // Update withdrawal wallet
  const withdrawalWalletData = {};
  withdrawalWalletData[pkg] = parseFloat(
    (amount * count + user.withdrawalWallet[pkg]).toFixed(2)
  );

  await database.withdrawalWallet.update({
    where: {
      userId: user.id,
    },
    data: withdrawalWalletData,
  });

  // When all actions are completed, return "yes"
  return true;
};

export {
  getUserForTestimonyBonus,
  createTestimonyRequest,
  getAllUserTestimony,
  getAllTestimony,
  rejectUserTestimony,
  acceptUserTestimony,
};
