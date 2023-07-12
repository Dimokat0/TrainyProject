import { Model } from 'sequelize';

export interface UserAttributes {
  id: number;
  username: string;
  password: string;
  role_id: number;
}

export interface UserModel extends Model<UserAttributes>, UserAttributes {}

declare const users: UserModel;

export default users;
