const authRepository = require("../repository/authRepository");

class AuthService {
  async registerUser(username, password) {
    await authRepository.registerUser(username, password);
  }

  async loginUser(username, password) {
    return await authRepository.loginUser(username, password);
  }
}

module.exports = new AuthService();
