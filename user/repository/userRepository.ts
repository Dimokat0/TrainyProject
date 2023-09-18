import { users, roles } from '../../models';
import sequelize from '../../sequelize';
import bcrypt from 'bcrypt';

interface User {
  username: string;
  password: string;
  role_id: number;
}

class UserRepository {
  async createUser(username: string, password: string, roleId?: number): Promise<void> {
    if (!roleId) {
      roleId = 1;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await sequelize.models.users.create({
      username,
      password: hashedPassword,
      role_id: roleId,
    });
  }

  async getRoleById(id: number): Promise<any> {
    return await roles.findByPk(id);
  }

  async updateUser(id: number, username?: string, password?: string, roleId?: number): Promise<void> {
    const updateData: { username?: string; password?: string; role_id?: number } = {};
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
    await sequelize.models.users.update(updateData, { where: { id } });
  }


  async updateUserRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await sequelize.models.users.update(
      { refresh_token: refreshToken },
      { where: { id: userId } }
    );
  }

  async getUserById(id: number): Promise<any> {
    return await sequelize.models.users.findByPk(id);
  }

  async getUserByUsername(username: string): Promise<any> {
    return await sequelize.models.users.findOne({ where: { username } });
  }

  async getAllUsers(): Promise<any[]> {
    return await sequelize.models.users.findAll();
  }

  async deleteUser(id: number): Promise<void> {
    await sequelize.models.users.destroy({ where: { id } });
  }

  async getRoles(): Promise<any[]> {
    return await sequelize.models.roles.findAll();
  }
}

export default new UserRepository();
