import nodemailer from "nodemailer";
import mailTemplates from "../utils/mailTemplates.js";

const transporter = nodemailer.createTransport({
  host: "host75.registrar-servers.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASS,
  },
});

// async..await is not allowed in global scope, must use a wrapper
export async function sendMail() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: process.env.EMAIL_AUTH_USER, // sender address
    to: "dtechlord@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    html: mailTemplates.withdrawal(), // html body
  });

  console.log("Message sent: %s", info.messageId);
}

export async function sendWithdrawalOtpMail(fullName, otp, email) {
  await transporter.sendMail({
    from: `"Grand Health Cycle " <${process.env.EMAIL_AUTH_USER}>`,
    to: email,
    subject: "Your OTP Code for Withdrawal Request",
    html: mailTemplates.withdrawal(fullName, otp),
  });
}
export async function sendAdminOtpMail(username, otp, email) {
  try {
    await transporter.sendMail({
      from: `"Grand Health Cycle " <${process.env.EMAIL_AUTH_USER}>`,
      to: email,
      subject: "Your OTP Code for Admin Access",
      html: mailTemplates.adminOTP(username, otp),
    });
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

export async function sendresetPasswordOtpMail(fullName, otp, email) {
  try {
    await transporter.sendMail({
      from: `"Grand Health Cycle " <${process.env.EMAIL_AUTH_USER}>`,
      to: email,
      subject: "Your OTP Code for Password Reset",
      html: mailTemplates.resetPassword(fullName, otp),
    });

    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}
export async function sendWelcomeMail(fullName, email) {
  await transporter.sendMail({
    from: `"Grand Health Cycle " <${process.env.EMAIL_AUTH_USER}>`,
    to: email,
    subject: "Welcome to Grand Health Cycle",
    html: mailTemplates.welcome(fullName),
  });
}
export async function sendBlockedMemberMail(fullName, email, reason) {
  await transporter.sendMail({
    from: `"Grand Health Cycle " <${process.env.EMAIL_AUTH_USER}>`,
    to: email,
    subject: "Your Account Has Been Blocked",
    html: mailTemplates.blockMember(fullName, reason),
  });
}
export async function sendUnblockedMemberMail(fullName, email) {
  await transporter.sendMail({
    from: `"Grand Health Cycle " <${process.env.EMAIL_AUTH_USER}>`,
    to: email,
    subject: "Account Unblocked Notification",
    html: mailTemplates.unblockMember(fullName),
  });
}
