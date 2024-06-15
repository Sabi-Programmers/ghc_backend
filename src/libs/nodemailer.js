import nodemailer from 'nodemailer'
import mailTemplates from '../utils/mailTemplates.js'

const transporter = nodemailer.createTransport({
    host: 'host75.registrar-servers.com',
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASS,
    },
})

export async function sendWithdrawalOtpMail(fullName, otp, email) {
    await transporter.sendMail({
        from: `"Grand Health Cycle " <${process.env.EMAIL_AUTH_USER}>`,
        to: email,
        subject: 'Your OTP Code for Withdrawal Request',
        html: mailTemplates.withdrawal(fullName, otp),
    })
}

export async function sendresetPasswordOtpMail(fullName, otp, email) {
    try {
        await transporter.sendMail({
            from: `"Grand Health Cycle " <${process.env.EMAIL_AUTH_USER}>`,
            to: email,
            subject: 'Your OTP Code for Password Reset',
            html: mailTemplates.resetPassword(fullName, otp),
        })

        return true
    } catch (error) {
        error
        return false
    }
}
export async function sendWelcomeMail(fullName, email) {
    await transporter.sendMail({
        from: `"Grand Health Cycle " <${process.env.EMAIL_AUTH_USER}>`,
        to: email,
        subject: 'Welcome to Grand Health Cycle',
        html: mailTemplates.welcome(fullName),
    })
}
export async function sendBlockedMemberMail(fullName, email, reason) {
    await transporter.sendMail({
        from: `"Grand Health Cycle " <${process.env.EMAIL_AUTH_USER}>`,
        to: email,
        subject: 'Your Account Has Been Blocked',
        html: mailTemplates.blockMember(fullName, reason),
    })
}
export async function sendUnblockedMemberMail(fullName, email) {
    await transporter.sendMail({
        from: `"Grand Health Cycle " <${process.env.EMAIL_AUTH_USER}>`,
        to: email,
        subject: 'Account Unblocked Notification',
        html: mailTemplates.unblockMember(fullName),
    })
}
