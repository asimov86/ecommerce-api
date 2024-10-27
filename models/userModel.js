// models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: { type: Boolean, default: false },
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  resetPasswordToken: String, 
  resetPasswordExpires: Date,
}, {
  timestamps: true,
});

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash de la contraseña antes de guardar el usuario
/* userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); // Aquí debes asegurarte de retornar para evitar que se ejecute el hash si no se modifica la contraseña
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next(); // Asegúrate de llamar a next() después de hashear la contraseña
}); */

const User = mongoose.model('User', userSchema);
module.exports = User;

