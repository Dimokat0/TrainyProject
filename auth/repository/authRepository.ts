import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userService from '../../user/service/userService';
import { LoginResult } from '../../auth';

const tokens = {"ACCESS_TOKEN":"a4xupeKrawRyD9InXhdR", "REFRESH_TOKEN":"WIKMpCMUlGkJJmNDAdQK"}
process.env.ACCESS_TOKEN_SECRET = tokens.ACCESS_TOKEN;
process.env.REFRESH_TOKEN_SECRET = tokens.REFRESH_TOKEN;

class AuthRepository {
  async registerUser(username: string, password: string): Promise<void> {
    await userService.createUser(username, password);
  }

  async loginUser(username: string, password: string): Promise<LoginResult> {
    const user = await userService.getUserByUsername(username);
    if (!user) {
      return { success: false, message: 'Wrong username!' };
    } else {
      const hashedPassword = user.password;
      const match = await bcrypt.compare(password, hashedPassword);
      if (match) {
        const accessToken = jwt.sign(
          { userId: user.id },
          process.env.ACCESS_TOKEN_SECRET as string,
          { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
          { userId: user.id },
          process.env.REFRESH_TOKEN_SECRET as string
        );
        const userId = user.id;
        await userService.updateUserRefreshToken(user.id, refreshToken);
        return { success: true, accessToken, refreshToken, userId };
      } else {
        return { success: false, message: 'Wrong password!' };
      }
    }
  }
}

export default new AuthRepository();
