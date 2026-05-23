import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  socketTimeout: 10000,
  pool: {
    maxConnections: 1,
    maxMessages: 5,
    rateDelta: 5000,
    rateLimit: 5,
  },
} as any);

export interface MailData {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}

export const SendMail = async (mailData: MailData) => {
  try {
    const response = await transporter.sendMail(mailData);
    console.log("Email sent successfully:", response.messageId);
    return response;
  } catch (error) {
    console.error("Nodemailer error:", error);
    throw error;
  }
};
