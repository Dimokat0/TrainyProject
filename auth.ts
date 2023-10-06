import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { authenticate, authorize } from './authMiddleware';
import { users } from './models/users'

interface MyJwtPayload extends JwtPayload {
  userId: number;
}

interface VerifyResult {
  valid: boolean;
  payload?: MyJwtPayload;
}

interface NewAccessTokenResult {
  success: boolean;
  accessToken?: string;
}

interface LoginResult {
  success: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
}

const tokens = {"ACCESS_TOKEN":"a4xupeKrawRyD9InXhdR", "REFRESH_TOKEN":"WIKMpCMUlGkJJmNDAdQK"}
process.env.ACCESS_TOKEN_SECRET = tokens.ACCESS_TOKEN;
process.env.REFRESH_TOKEN_SECRET = tokens.REFRESH_TOKEN;

async function registerUser(username: string, password: string): Promise<void> {
  const hashedPassword = await bcrypt.hash(password, 10);
  await users.create({
    username,
    password: hashedPassword,
  });
}

async function loginUser(username: string, password: string): Promise<LoginResult> {
  const user = await users.findOne({ where: { username } });

  if (!user) {
    return { success: false, message: 'Wrong username!' };
  } else {
    const hashedPassword = user.password;
    const match = await bcrypt.compare(password, hashedPassword);
    if (match) {
      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: '60m' }
      );
      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.REFRESH_TOKEN_SECRET as string
      );
      await users.update(
        { refresh_token: refreshToken },
        { where: { id: user.id } }
      );
      const userId: number = user.id
      return { success: true, accessToken, refreshToken, userId };
    } else {
      return { success: false, message: 'Wrong password!' };
    }
  }
}

function verifyAccessToken(accessToken: string): VerifyResult {
  try {
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as MyJwtPayload;
    return { valid: true, payload };
  } catch (err) {
    console.log(err);
    return { valid: false };
  }
}

async function generateNewAccessToken(refreshToken: string): Promise<NewAccessTokenResult> {
  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as MyJwtPayload;
    const userId = payload.userId;

    const user = await users.findOne({
      where: { id: userId, refresh_token: refreshToken },
    });

    if (!user) {
      return { success: false };
    } else {
      const accessToken = jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: '60m' }
      );
      return { success: true, accessToken };
    }
  } catch (err) {
    return { success: false };
  }
}

export {
  registerUser,
  loginUser,
  verifyAccessToken,
  generateNewAccessToken,
  authenticate,
  authorize,
  LoginResult,
};
