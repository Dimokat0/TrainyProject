'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class roles extends Model {
    static associate(models) {
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
