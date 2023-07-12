import { Model } from 'sequelize';

export default (sequelize: any, DataTypes: any) => {
  class roles extends Model {
    static associate(models: any) {
      roles.hasMany(models.users, { foreignKey: 'role_id' });
    }
  }
  roles.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'roles',
    }
  );
  return roles;
};
