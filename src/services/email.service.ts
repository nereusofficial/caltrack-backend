import nodemailer from "nodemailer";

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const transporter = createTransporter();

  const verifyUrl = `${process.env.BACKEND_URL}/api/auth/verify/${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "Verify your CalTrack account",
    html: `
      <h2>Welcome to CalTrack</h2>
      <p>Please verify your account by clicking below:</p>
      <a href="${verifyUrl}">Verify Account</a>
    `,
  });
};

export const sendResetPasswordEmail = async (
  email: string,
  token: string
) => {
  const transporter = createTransporter();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "Reset your CalTrack password",
    html: `
      <h2>Password Reset Request</h2>
      <p>Click below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
    `,
  });
};