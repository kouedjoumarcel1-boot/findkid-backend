const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Utilisateur = sequelize.define('Utilisateur', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING, allowNull: false },
  prenom: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  telephone: { type: DataTypes.STRING, allowNull: false },
  motDePasse: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.ENUM('citoyen', 'administrateur', 'poste_police', 'organisation'),
    allowNull: false,
  },
  statutCompte: {
    type: DataTypes.ENUM('ACTIF', 'INACTIF', 'SUSPENDU'),
    defaultValue: 'ACTIF',
  },
}, {
  tableName: 'utilisateurs',
  timestamps: true,
});

module.exports = Utilisateur;