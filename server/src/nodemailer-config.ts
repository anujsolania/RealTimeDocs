import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  socketTimeout: 10000,
});

export interface MailData {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}

export const SendMail = async (mailData: MailData) => {
  const response = await transporter.sendMail(mailData);
  return response;
};
