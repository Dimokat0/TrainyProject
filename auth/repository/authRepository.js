const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../../user/service/userService");

let tokens = require("../../tokens.json");
process.env.ACCESS_TOKEN_SECRET = tokens.ACCESS_TOKEN;
process.env.REFRESH_TOKEN_SECRET = tokens.REFRESH_TOKEN;

class AuthRepository {
  async registerUser(username, password) {
    await userService.createUser(username, password);
  }

  async loginUser(username, password) {
    const user = await userService.getUserByUsername(username);

    if (!user) {
      return { success: false, message: "Wrong username!" };
    } else {
      const hashedPassword = user.password;
      const match = await bcrypt.compare(password, hashedPassword);
      if (match) {
        const accessToken = jwt.sign(
          { userId: user.id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );
        const refreshToken = jwt.sign(
          { userId: user.id },
          process.env.REFRESH_TOKEN_SECRET
        );
        await userService.updateUserRefreshToken(user.id, refreshToken);
        return { success: true, accessToken, refreshToken };
      } else {
        return { success: false, message: "Wrong password!" };
      }
    }
  }
}

module.exports = new AuthRepository();
