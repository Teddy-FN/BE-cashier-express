'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('type_payment', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      store: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      status: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('type_payment')
  }
}
