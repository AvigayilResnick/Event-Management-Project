import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import db from '../db/dbConnection.js';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({ to, subject, text, html, replyTo }) {
  const mailOptions = {
    from: `"Event Manager" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
    replyTo,  // מוסיף אפשרות תגובה לכתובת השולח
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', info.response);
  return info;
}
