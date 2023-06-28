const jwt = require('jsonwebtoken');
const { users, roles } = require('./models');

function authenticate(req, res, next) {
  // Get access token from cookie
  const cookies = req.headers.cookie.split('; ');
  const accessTokenCookie = cookies.find((cookie) =>
    cookie.startsWith('accessToken=')
  );
  const accessToken = accessTokenCookie
    ? accessTokenCookie.split('=')[1]
    : null;

  // Verify access token
  if (!accessToken) {
    return res.sendStatus(401); // Unauthorized
  }
  try {
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.sendStatus(403); // Forbidden
  }
}

function authorize(role) {
  return async (req, res, next) => {
    const userId = req.user.userId;
    const user = await users.findOne({
      where: { id: userId },
      include: roles,
    });
    if (!user) {
      return res.sendStatus(404); // Not Found
    } else {
      if (user.role.name !== role) {
        return res.sendStatus(403); // Forbidden
      }
      next();
    }
  };
}

module.exports = { authenticate, authorize };
