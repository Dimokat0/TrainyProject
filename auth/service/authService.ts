import authRepository from '../repository/authRepository';
import { LoginResult } from '../../auth';

class AuthService {
  async registerUser(username: string, password: string): Promise<void> {
    await authRepository.registerUser(username, password);
  }

  async loginUser(username: string, password: string): Promise<LoginResult> {
    return await authRepository.loginUser(username, password);
  }
}

export default new AuthService();
