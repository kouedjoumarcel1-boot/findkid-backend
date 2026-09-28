const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PieceIdentite = sequelize.define('PieceIdentite', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cheminFichier: { type: DataTypes.STRING, allowNull: false },
  statutVerification: {
    type: DataTypes.ENUM('EN_ATTENTE', 'VERIFIEE', 'REJETEE'),
    defaultValue: 'EN_ATTENTE',
  },
}, {
  tableName: 'pieces_identite',
  timestamps: true,
});

module.exports = PieceIdentite;