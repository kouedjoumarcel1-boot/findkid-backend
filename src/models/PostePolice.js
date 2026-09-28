const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PostePolice = sequelize.define('PostePolice', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nomPoste: { type: DataTypes.STRING, allowNull: false },
  ville: { type: DataTypes.STRING, allowNull: false },
  quartier: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'postes_police',
  timestamps: true,
});

module.exports = PostePolice;