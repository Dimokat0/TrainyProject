import { Sequelize } from 'sequelize-typescript';
import { users, roles, posts } from './models';

const sequelizedb = new Sequelize({
  dialect: 'postgres',
  database: 'first_project',
  username: 'postgres',
  password: 'qwerty',
  logging: false
});

sequelizedb.addModels([users, roles, posts]);

sequelizedb.sync();

export default sequelizedb;