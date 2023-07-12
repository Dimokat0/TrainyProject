import { Model } from 'sequelize';

export interface RoleAttributes {
  id: number;
  name: string;
}

export interface RoleModel extends Model<RoleAttributes>, RoleAttributes {}

declare const roles: RoleModel;

export default roles;
