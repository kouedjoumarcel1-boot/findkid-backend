const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enfant = sequelize.define('Enfant', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING, allowNull: true },
  prenom: { type: DataTypes.STRING, allowNull: true },
  intervalleAge: { type: DataTypes.STRING, allowNull: true },
  sexe: { type: DataTypes.ENUM('M', 'F', 'INCONNU'), defaultValue: 'INCONNU' },
  descriptionPhysique: { type: DataTypes.TEXT, allowNull: true },
  photo: { type: DataTypes.STRING, allowNull: true },
  embeddingFacial: { type: DataTypes.JSON, allowNull: true },
}, {
  tableName: 'enfants',
  timestamps: true,
});

module.exports = Enfant;