const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Administrateur = sequelize.define('Administrateur', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, {
  tableName: 'administrateurs',
  timestamps: true,
});

module.exports = Administrateur;