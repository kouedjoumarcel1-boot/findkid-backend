const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ResultatRecherche = sequelize.define('ResultatRecherche', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  distance: { type: DataTypes.FLOAT, allowNull: false },
  seuil: { type: DataTypes.FLOAT, allowNull: false },
  verified: { type: DataTypes.BOOLEAN, allowNull: false },
}, {
  tableName: 'resultats_recherche',
  timestamps: true,
});

module.exports = ResultatRecherche;