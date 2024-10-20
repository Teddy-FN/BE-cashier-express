'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nameProduct: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true
      },
      image: {
        allowNull: false,
        type: Sequelize.STRING
      },
      imageName: {
        type: Sequelize.STRING
      },
      category: {
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.STRING
      },
      isOption: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      option: {
        allowNull: true,
        defaultValue: [],
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      },
      status: {
        primaryKey: true,
        type: Sequelize.BOOLEAN
      },
      store: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true
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
    await queryInterface.dropTable('product')
  }
}
