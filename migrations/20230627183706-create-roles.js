'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('roles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    const date = new Date();
    await queryInterface.bulkInsert('roles', [
      { id: 1, name: 'member', createdAt: date, updatedAt: date },
      { id: 2, name: 'administrator', createdAt: date, updatedAt: date },
      { id: 3, name: 'superAdmin', createdAt: date, updatedAt: date },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('roles');
  },
};
