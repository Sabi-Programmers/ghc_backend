import bcrypt from "bcryptjs";
import crypto from "crypto";
import database from "../libs/prisma.js";

const generateOtpToken = async (userId) => {
  // clear any old record
  await database.otpToken.deleteMany({
    where: { userId },
  });

  // generate OTP Token
  const generatedOtpToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  // save otp record
  const hashedOtpToken = await bcrypt.hash(generatedOtpToken, 10);

  await database.otpToken.create({
    data: {
      userId,
      token: hashedOtpToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  });
  return generatedOtpToken;
};

/**
 * verify OTP token
 */
const verifyOtpToken = async (token, id) => {
  const data = {
    status: false,
    message: "",
  };

  // ensure otp record exist
  const matchedOTPRecord = await database.otpToken.findFirst({
    where: { userId: id },
  });

  if (!matchedOTPRecord) {
    data.message = "Invalid otp token";
    return data;
  }

  // check for expired code
  const { expiresAt } = matchedOTPRecord;

  const currentDateTime = new Date();
  const isExpired = currentDateTime > new Date(expiresAt);
  if (isExpired) {
    await database.otpToken.deleteMany({ where: { userId: id } });
    data.message = "Code has expired. Request for a new one.";
    return data;
  }

  // check if Token Match
  const hashedOTP = matchedOTPRecord.token;
  const verifyOTP = await bcrypt.compare(token, hashedOTP);
  if (!verifyOTP) {
    data.message = "Invalid otp token";
    return data;
  }

  await database.otpToken.deleteMany({ where: { userId: id } });

  data.message = verifyOTP;
  data.status = true;

  return data;
};

export { generateOtpToken, verifyOtpToken };
