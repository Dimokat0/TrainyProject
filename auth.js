const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('./db');

process.env.ACCESS_TOKEN_SECRET = '4i1HDMwXSc5Cr2kzU23c';
process.env.REFRESH_TOKEN_SECRET = 'SRri3WT62bNrhHpuLFPM';

async function registerUser(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
    'INSERT INTO users (username, password) VALUES ($1, $2)',
    [username, hashedPassword]
    );
}

async function loginUser(username, password) {
    const result = await pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
    );

    if (result.rows.length === 0) {
    return { success: false, message: 'Wrong username!' };
    } else {
        const user = result.rows[0];
        const hashedPassword = user.password;
        const match = await bcrypt.compare(password, hashedPassword);
        if (match) {
            const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET);
            await pool.query(
            'UPDATE users SET refresh_token = $1 WHERE id = $2',
            [refreshToken, user.id]
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
            console.log(err)
            return { valid: false };
    }
}

async function generateNewAccessToken(refreshToken) {
    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userId = payload.userId;

        const result = await pool.query(
        'SELECT * FROM users WHERE id = $1 AND refresh_token = $2',
        [userId, refreshToken]
        );

        if (result.rows.length === 0) {
            return { success: false };
        } else {
            const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            return { success: true, accessToken };
        }
    } catch (err) {
        return { success: false };
    }
}

function authenticate(req, res, next) {
    // Get access token from request headers
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];
  
    // Verify access token
    if (!accessToken) {
      return res.sendStatus(401); // Unauthorized
    }
    const result = verifyAccessToken(accessToken);
    if (!result.valid) {
      return res.sendStatus(403); // Forbidden
    }
  
    // Get user from database
    pool.query(
      'SELECT * FROM users INNER JOIN roles ON users.role_id = roles.id WHERE users.id = $1',
      [result.payload.userId],
      (err, result) => {
        if (err) throw err;
        if (result.rows.length === 0) {
          return res.sendStatus(404); // Not Found
        } else {
          const user = result.rows[0];
          req.user = user;
          next();
        }
      }
    );
}
  
function authorize(role) {
return (req, res, next) => {
    if (req.user.role_name !== role) {
    return res.sendStatus(403); // Forbidden
    }
    next();
};
}
  
module.exports = { registerUser, loginUser, verifyAccessToken, generateNewAccessToken, authenticate, authorize };