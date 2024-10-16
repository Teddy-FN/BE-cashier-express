'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('member', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nameMember: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      phoneNumber: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      store: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      point: {
        type: Sequelize.BIGINT
      },
      createdBy: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      modifiedBy: {
        type: Sequelize.STRING
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.STRING
      }
    })
  },
  async down(queryInterface) {
    await queryInterface.dropTable('member')
  }
}
