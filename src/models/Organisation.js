const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Organisation = sequelize.define('Organisation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nomOrganisation: { type: DataTypes.STRING, allowNull: false },
  typeOrganisation: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: 'organisations',
  timestamps: true,
});

module.exports = Organisation;