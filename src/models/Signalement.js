const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Signalement = sequelize.define('Signalement', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.ENUM('DISPARITION', 'RETROUVAILLE'), allowNull: false },
  statut: {
    type: DataTypes.ENUM('EN_ATTENTE', 'VALIDE', 'REJETE', 'PUBLIE', 'CLOTURE', 'SUPPRIME'),
    defaultValue: 'EN_ATTENTE',
  },
  description: { type: DataTypes.TEXT, allowNull: true },
  circonstances: { type: DataTypes.TEXT, allowNull: true },
  dateEvenement: { type: DataTypes.DATE, allowNull: true },
  lieu: { type: DataTypes.STRING, allowNull: true },
  latitude: { type: DataTypes.FLOAT, allowNull: true },
  longitude: { type: DataTypes.FLOAT, allowNull: true },
  motifRejet: { type: DataTypes.STRING, allowNull: true },

actif: {
  type: DataTypes.BOOLEAN,
  defaultValue: true,
},
},
 {
  tableName: 'signalements',
  timestamps: true,
});

module.exports = Signalement;