/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.bulkInsert('Roles', [{
        id: 1,
        name: 'member',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 2,
        name: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 3,
        name: 'superAdmin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Roles');
  }
};