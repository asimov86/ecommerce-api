const { JWT_SECRET } = require('../config/config');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');

// Función para generar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// Función para configurar el transportador de Nodemailer
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'Gmail', // Cambia el servicio si usas otro
    auth: {
      user: process.env.EMAIL_USER, // Tu dirección de correo
      pass: process.env.EMAIL_PASS, // Tu contraseña de correo
    },
  });
};

// Función para enviar correos electrónicos
const sendEmail = async (to, subject, text) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado: ' + to);
  } catch (error) {
    console.error('Error al enviar correo: ', error);
  }
};

const sendResetEmail = async (email, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/verify?token=${token}`;

  await sendEmail(email, 'Restablecer tu contraseña', 
    `Hola, has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para proceder: ${resetLink}. 
    Este enlace es válido por una hora.`);
};

// Función para registrar un nuevo usuario
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'El usuario ya existe' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  if (user) {
    // Token para verificación de cuenta
    const generateVerificationToken = (id) => {
      return jwt.sign({ id, purpose: 'verify' }, JWT_SECRET, { expiresIn: '24h' }); // Agregamos el propósito
    };

    const token = generateVerificationToken(user._id); // Genera un token para la verificación

    const verificationLink = `${process.env.FRONTEND_URL}/verify?token=${token}`; // Link de verificación

    // Enviar correo con el token
    await sendEmail(email, 'Verifica tu cuenta', `Hola ${name}, verifica tu cuenta haciendo clic en el siguiente link: ${verificationLink}`);

    res.status(201).json({ message: 'Usuario registrado correctamente. Verifica tu correo para activar tu cuenta.' });
  } else {
    res.status(400).json({ message: 'Datos de usuario inválidos' });
  }
});


// Autenticar usuario y obtener token
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isActive) {
      return res.status(401).json({ message: 'Por favor, verifica tu correo para activar tu cuenta.' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Credenciales inválidas' });
  }
});


// Cambiar la contraseña del usuario
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Buscar el usuario en la base de datos usando el ID del usuario autenticado
  const user = await User.findById(req.user._id);

  // Verificar si el usuario existe
  if (!user) {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }

  // Verificar si la contraseña actual es correcta
  const isMatch = await bcrypt.compare(currentPassword, user.password); // Comparar con la contraseña hasheada
  if (!isMatch) {
    res.status(401);
    throw new Error('La contraseña actual es incorrecta');
  }

  // Hashear la nueva contraseña antes de guardarla
  user.password = await bcrypt.hash(newPassword, 10); // Hasheamos la nueva contraseña
  await user.save();

  // Enviar un correo de notificación al usuario
  await sendEmail(user.email, 'Contraseña Cambiada', 'Tu contraseña ha sido cambiada con éxito.');

  res.status(200).json({ message: 'Contraseña actualizada con éxito' });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verificar que el propósito sea 'reset'
    if (decoded.purpose !== 'reset') {
      return res.status(400).json({ message: 'Token inválido para restablecimiento de contraseña.' });
    }

    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Verifica que el token no haya expirado
    });

    if (!user) {
      return res.status(400).json({ message: 'Token inválido o expirado.' });
    }

    // Hashear la nueva contraseña y guardar
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined; // Eliminar el token de restablecimiento
    user.resetPasswordExpires = undefined; // Eliminar la expiración
    await user.save();

    res.status(200).json({ message: 'Contraseña restablecida con éxito.' });
  } catch (error) {
    res.status(400).json({ message: 'Token inválido o expirado.' });
  }
});



const verifyUser = asyncHandler(async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verificar que el propósito sea 'verify'
    if (decoded.purpose !== 'verify') {
      return res.status(400).json({ message: 'Token inválido para verificación de cuenta.' });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    if (user.isActive) {
      return res.status(400).json({ message: 'El usuario ya está verificado.' });
    }

    // Actualizar el estado del usuario a verificado
    user.isActive = true;
    await user.save();
    // Después de la verificación exitosa, redirigir al frontend
    res.redirect('http://localhost:3000/login');  
    //res.status(200).json({ message: 'Cuenta verificada con éxito. Ya puedes iniciar sesión.' });
    // Redirigir al frontend después de verificar el correo
    //return res.redirect('http://localhost:3000/login'); // Redirigir a la página de login en tu frontend
  } catch (error) {
    res.status(400).json({ message: 'Token inválido o expirado.' });
  }
});


const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'No se encontró una cuenta con ese email.' });
  }

  // Token para restablecimiento de contraseña
  const generateResetToken = (id) => {
    return jwt.sign({ id, purpose: 'reset' }, JWT_SECRET, { expiresIn: '1h' }); // Agregamos el propósito
  };

  // Generar el token de restablecimiento de contraseña
  //const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

  const token = generateResetToken(user._id); // Genera un token para la verificación

  // Guardar el token y la fecha de expiración en la base de datos
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hora desde ahora
  await user.save();

  // Enviar el correo con el token
  await sendResetEmail(user.email, token);

  res.status(200).json({ message: 'Correo enviado con el enlace para restablecer la contraseña.' });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password'); // Excluir la contraseña de la respuesta
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
});


// Exportar funciones
module.exports = {
  registerUser,
  authUser,
  changePassword,
  verifyUser,
  requestPasswordReset,
  resetPassword,
  getUserProfile
};
