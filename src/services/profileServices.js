import bcrypt from "bcryptjs";
import database from "../libs/prisma.js";
import { excludeData } from "../utils/index.js";

const getUserProfile = async (id) => {
  const user = await database.user.findUnique({
    where: { id },
  });

  return excludeData(user, ["password"]);
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
      accountNumber: data.accountNumber,
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

export { getUserProfile, updateUserProfile, changeUserPassword };
