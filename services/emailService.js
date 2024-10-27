const nodemailer = require('nodemailer');

// Configura el transportador
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Cambia el servicio si usas otro
  auth: {
    user: process.env.EMAIL_USER, // Tu dirección de correo
    pass: process.env.EMAIL_PASS, // Tu contraseña de correo
  },
});

// Función para enviar correos electrónicos
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw new Error('No se pudo enviar el correo');
  }
};

module.exports = {
  sendEmail,
};
