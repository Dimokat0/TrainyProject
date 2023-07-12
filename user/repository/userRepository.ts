import db from '../../models';
import bcrypt from 'bcrypt';

const { users, roles } = db;

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
    await users.create({
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
    await users.update(updateData, { where: { id } });
  }
  

  async updateUserRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await users.update(
      { refresh_token: refreshToken },
      { where: { id: userId } }
    );
  }

  async getUserById(id: number): Promise<any> {
    return await users.findByPk(id);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return await users.findOne({ where: { username } });
  }

  async getAllUsers(): Promise<any[]> {
    return await users.findAll();
  }

  async deleteUser(id: number): Promise<void> {
    await users.destroy({ where: { id } });
  }

  async getRoles(): Promise<any[]> {
    return await roles.findAll();
  }
}

export default new UserRepository();
