require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function envoyerEmail(destinataire, sujet, message) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinataire,
    subject: sujet,
    text: message
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.error('Erreur lors de l’envoi de l’email :', error);
    } else {
      console.log('Email envoyé :', info.response);
    }
  });
}

module.exports = { envoyerEmail };
