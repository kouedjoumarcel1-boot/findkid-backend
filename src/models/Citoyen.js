const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Citoyen = sequelize.define('Citoyen', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cheminCNI: { type: DataTypes.STRING, allowNull: false },
  statutVerificationCNI: {
    type: DataTypes.ENUM('EN_ATTENTE', 'VERIFIEE', 'REJETEE'),
    defaultValue: 'EN_ATTENTE',
  },
}, {
  tableName: 'citoyens',
  timestamps: true,
});

module.exports = Citoyen;