const jwt = require('jsonwebtoken');

function generateToken(user) {
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    return token;
}

module.exports = { generateToken };