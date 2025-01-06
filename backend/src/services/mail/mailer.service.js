import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const __dirname = path.resolve();

dotenv.config();

console.log(__dirname);


const URL_VERIFY = "http://localhost:4000/api/verify?token=";

const generateEmailHtml = (token) => {
  const filePath = path.join(__dirname, "/public/mail-verify.html");
  let htmlContent = fs.readFileSync(filePath, "utf8");
  htmlContent = htmlContent.replace(
    "REPLACE_TOKEN_HERE",
    `${URL_VERIFY}${token}`
  );
  return htmlContent;
};

async function sendVerificationEmail(token, recipientEmail) {
  try {
    // Configurar el transporte
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_KEY, // Usar contraseña de aplicación si es necesario
      },
    });

    // Generar el HTML con el token dinámico
    const htmlContent = generateEmailHtml(token);

    // Enviar el correo
    const info = await transporter.sendMail({
      from: `"MiTiendita" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: "Validación de Usuario - MiTiendita",
      html: htmlContent, // HTML con el token reemplazado
    });
  } catch (error) {
    throw new Error(
      "Error al enviar el correo de verificación " + error.message
    );
  }
}

export { sendVerificationEmail };
