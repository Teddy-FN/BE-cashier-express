'use strict'
const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')
module.exports = sequelize.define(
  'checkout',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    store: {
      allowNull: false,
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    invoice: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.STRING
    },
    dateOrder: {
      allowNull: false,
      type: DataTypes.DATE
    },
    dateCheckout: {
      primaryKey: true,
      type: DataTypes.DATE
    },
    totalPrice: {
      type: DataTypes.INTEGER
    },
    cashierName: {
      type: DataTypes.STRING
    },
    customerName: {
      type: DataTypes.STRING
    },
    customerPhoneNumber: {
      type: DataTypes.STRING
    },
    totalQuantity: {
      type: DataTypes.BIGINT
    },
    typePayment: {
      type: DataTypes.STRING
    },
    createdBy: {
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    modifiedBy: {
      type: DataTypes.STRING
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    deletedAt: {
      type: DataTypes.STRING
    }
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: 'checkout'
  }
)
