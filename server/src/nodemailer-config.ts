import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
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
