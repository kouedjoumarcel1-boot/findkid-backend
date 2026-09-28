const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ZoneCouverture = sequelize.define('ZoneCouverture', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quartier: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'zones_couverture',
  timestamps: false,
});

module.exports = ZoneCouverture;