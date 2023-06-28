const { users, roles } = require('../../models');
const bcrypt = require('bcrypt');

class UserRepository {
  async createUser(username, password, roleId) {
    if (!roleId) {
      roleId = 1;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await users.create({
      username,
      password: hashedPassword,
      role_id: roleId,
    });
  }

  async updateUser(id, username, password, roleId) {
    const updateData = {};
    if (username) {
      updateData.username = username;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }
    if (roleId) {
      updateData.role_id = roleId;
    }
    await users.update(updateData, { where: { id } });
  }

  async updateUserRefreshToken(userId, refreshToken) {
    await users.update({ refresh_token: refreshToken }, { where: { id: userId } });
  }

  async getUserById(id) {
    return await users.findByPk(id);
  }

  async getUserByUsername(username) {
    return await users.findOne({ where: { username } });
  }

  async getAllUsers() {
    return await users.findAll();
  }

  async deleteUser(id) {
    await users.destroy({ where: { id } });
  }

  async getRoles() {
    return await roles.findAll();
  }
}

module.exports = new UserRepository();