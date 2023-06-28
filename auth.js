const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { users } = require('./models');
const { authenticate, authorize } = require('./authMiddleware');

let tokens = require('./tokens.json');
process.env.ACCESS_TOKEN_SECRET = tokens.ACCESS_TOKEN;
process.env.REFRESH_TOKEN_SECRET = tokens.REFRESH_TOKEN;

async function registerUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  await users.create({
    username,
    password: hashedPassword,
  });
}

async function loginUser(username, password) {
  const user = await users.findOne({ where: { username } });

  if (!user) {
    return { success: false, message: 'Wrong username!' };
  } else {
    const hashedPassword = user.password;
    const match = await bcrypt.compare(password, hashedPassword);
    if (match) {
      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '60m' }
      );
      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.REFRESH_TOKEN_SECRET
      );
      await users.update(
        { refresh_token: refreshToken },
        { where: { id: user.id } }
      );
      return { success: true, accessToken, refreshToken };
    } else {
      return { success: false, message: 'Wrong password!' };
    }
  }
}

function verifyAccessToken(accessToken) {
  try {
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    return { valid: true, payload };
  } catch (err) {
    console.log(err);
    return { valid: false };
  }
}

async function generateNewAccessToken(refreshToken) {
  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userId = payload.userId;

    const user = await users.findOne({
      where: { id: userId, refresh_token: refreshToken },
    });

    if (!user) {
      return { success: false };
    } else {
      const accessToken = jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '60m' }
      );
      return { success: true, accessToken };
    }
  } catch (err) {
    return { success: false };
  }
}

module.exports = {
  registerUser,
  loginUser,
  verifyAccessToken,
  generateNewAccessToken,
  authenticate,
  authorize,
};
