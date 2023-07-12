import userRepository from '../repository/userRepository';

class UserService {
  async createUser(username: string, password: string, roleId?: number): Promise<void> {
    await userRepository.createUser(username, password, roleId);
  }

  async getUserByUsername(username: string): Promise<any> {
    return await userRepository.getUserByUsername(username);
  }

  async updateUserRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await userRepository.updateUserRefreshToken(userId, refreshToken);
  }
}

export default new UserService();
