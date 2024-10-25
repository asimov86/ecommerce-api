// controllers/userController.js
const { JWT_SECRET } = require('../config/config');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Función para generar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

console.log(JWT_SECRET);

// Registrar un nuevo usuario
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'El usuario ya existe' });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Datos de usuario inválidos' });
  }
};

// Autenticar usuario y obtener token
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Credenciales inválidas' });
  }
};

module.exports = {
  registerUser,
  authUser,
};
