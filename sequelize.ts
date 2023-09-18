import { Sequelize } from 'sequelize-typescript';
import { users, roles } from './models';

const sequelize = new Sequelize({
  dialect: 'postgres',
  database: 'first_project',
  username: 'postgres',
  password: 'qwerty',
});

sequelize.addModels([users, roles]);

sequelize.sync();

export default sequelize;