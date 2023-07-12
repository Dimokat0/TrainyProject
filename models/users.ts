import { Model } from 'sequelize';

export default (sequelize: any, DataTypes: any) => {
  class users extends Model {
    static associate(models: any) {
      users.belongsTo(models.roles, { foreignKey: 'role_id' });
    }
  }
  users.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      role_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'users',
    }
  );
  return users;
};