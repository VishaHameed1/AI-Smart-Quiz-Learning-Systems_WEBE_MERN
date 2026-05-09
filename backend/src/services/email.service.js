 const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  await transporter.sendMail({
    from: `"LearnSmart" <${process.env.EMAIL_USER}>`,
    to, subject, html
  });
};

const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/verify-email/${token}`;
  const html = `<a href="${url}">Verify Email</a>`;
  await sendEmail(email, 'Verify Your Email', html);
};

module.exports = { sendEmail, sendVerificationEmail };
