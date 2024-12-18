'use strict'
const { DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')
const sequelize = require('../../config/database')
module.exports = sequelize.define(
  'user',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    image: {
      type: DataTypes.STRING
    },
    userType: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    userName: {
      allowNull: false,
      type: DataTypes.STRING,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING
    },
    confirmPassword: {
      type: DataTypes.VIRTUAL,
      set(value) {
        if (value === this.password) {
          const hashPassword = bcrypt.hashSync(value, 10)
          this.setDataValue('password', hashPassword)
        } else {
          throw new Error('Password & Confirmation Password Tidak Sama')
        }
      }
    },
    email: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING
    },
    gender: {
      type: DataTypes.STRING
    },
    phoneNumber: {
      type: DataTypes.STRING
    },
    employeeID: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    statusEmployee: {
      type: DataTypes.BOOLEAN
    },
    statusActive: {
      type: DataTypes.BOOLEAN
    },
    placeDateOfBirth: {
      type: DataTypes.STRING
    },
    store: {
      allowNull: false,
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    shift: {
      allowNull: true,
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    position: {
      allowNull: true,
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    accessMenu: {
      type: DataTypes.TEXT
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    modifiedAt: {
      type: DataTypes.STRING
    },
    deletedAt: {
      type: DataTypes.STRING
    }
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: 'user'
  }
)
