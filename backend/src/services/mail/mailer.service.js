import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport("SMTP", {
  service: process.env.EMAIL_SERVICE, // Use your email provider
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Test connection
transporter.verify((error, success) => {
  try {
    if (error) {
      console.error("Error connecting to email service:", error);
    } else {
      console.log("Email service is ready to send messages:", success);
    }
  } catch (error) {
    console.error("Error verifying email service:", error);
  }
});

// TODO - Add email sending logic here
