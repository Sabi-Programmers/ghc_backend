import bcrypt from "bcryptjs";
import database from "../libs/prisma.js";
import { excludeData } from "../utils/index.js";

const getUserProfile = async (id) => {
  const user = await database.user.findUnique({
    where: { id },
  });

  return excludeData(user, ["password"]);
};

const updateUserDisplayPhoto = async (id, photo) => {
  return await database.user.update({
    where: { id },
    data: {
      displayPhoto: photo,
    },
  });
};
const updateUserProfile = async (id, data) => {
  return await database.user.update({
    where: { id },
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      city: data.city,
      country: data.country,
      gender: data.gender.toLowerCase(),
      accountName: data.accountName,
      accountNumber: data.accountNumber == "" ? null : data.accountNumber,
      bankName: data.bankName,
    },
  });
};

const changeUserPassword = async (id, oldPassword, password) => {
  const user = await database.user.findUnique({ where: { id } });

  if (!bcrypt.compareSync(oldPassword, user.password)) {
    return false;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await database.user.update({
    where: { id },
    data: { password: hashedPassword },
  });
};

const deleteUserOtherSessions = async (req) => {
  const { id: userId, role } = req.user;
  const currentSession = req.sessionID;
  const allUsersSession = await database.sessions.findMany({
    where: {
      sess: {
        path: ["passport"],
        equals: {
          user: { id: userId, role },
        },
      },
    },
  });

  // Filter out the current session
  const sessionsToDelete = allUsersSession.filter(
    (session) => session.sid !== currentSession
  );

  // Delete the filtered sessions
  const deletePromises = sessionsToDelete.map((session) =>
    database.sessions.delete({
      where: { sid: session.sid },
    })
  );

  // Wait for all delete operations to complete
  await Promise.all(deletePromises);
};

export {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  deleteUserOtherSessions,
  updateUserDisplayPhoto,
};
