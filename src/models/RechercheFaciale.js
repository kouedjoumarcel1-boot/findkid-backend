const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RechercheFaciale = sequelize.define('RechercheFaciale', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  photoRecherche: { type: DataTypes.STRING, allowNull: false },
  statut: {
    type: DataTypes.ENUM('EN_ATTENTE', 'EN_COURS', 'TERMINEE', 'ERREUR'),
    defaultValue: 'EN_ATTENTE',
  },
}, {
  tableName: 'recherches_faciales',
  timestamps: true,
});

module.exports = RechercheFaciale;