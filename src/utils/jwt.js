const jwt = require('jsonwebtoken');

const genererToken = (utilisateur) => {
  return jwt.sign(
    { id: utilisateur.id, role: utilisateur.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = { genererToken };