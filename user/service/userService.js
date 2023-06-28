const userRepository = require("../repository/userRepository");

class UserService {
  async createUser(username, password, roleId) {
    await userRepository.createUser(username, password, roleId);
  }

  async getUserByUsername(username) {
    return await userRepository.getUserByUsername(username);
  }

  async updateUserRefreshToken(userId, refreshToken) {
    await userRepository.updateUserRefreshToken(userId, refreshToken);
  }
}

module.exports = new UserService();
