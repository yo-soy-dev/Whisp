import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // only needed for local dev / self-signed certs
  },
});

export const mail = async ({ to, subject, body }) => {
  // Make sure this email is verified in Brevo
  const fromEmail = `"Whisp Team" <${process.env.SENDER_EMAIL}>`;

  console.log("Sending email from:", fromEmail, "to:", to);

  const response = await transporter.sendMail({
    from: fromEmail,
    to,
    subject,
    html: body,
  });

  return response;
};

export default mail;
