const sequelize = require('../config/database');
const Utilisateur = require('./Utilisateur');
const Citoyen = require('./Citoyen');
const Administrateur = require('./Administrateur');
const Organisation = require('./Organisation');
const PostePolice = require('./PostePolice');
const Enfant = require('./Enfant');
const Signalement = require('./Signalement');
const Notification = require('./Notification');
const Message = require('./Message');
const RechercheFaciale = require('./RechercheFaciale');
const ResultatRecherche = require('./ResultatRecherche');

// Héritage conceptuel : chaque rôle est lié 1-1 à un Utilisateur
Utilisateur.hasOne(Citoyen, { foreignKey: 'utilisateurId', onDelete: 'CASCADE' });
Citoyen.belongsTo(Utilisateur, { foreignKey: 'utilisateurId' });

Utilisateur.hasOne(Administrateur, { foreignKey: 'utilisateurId', onDelete: 'CASCADE' });
Administrateur.belongsTo(Utilisateur, { foreignKey: 'utilisateurId' });

Utilisateur.hasOne(Organisation, { foreignKey: 'utilisateurId', onDelete: 'CASCADE' });
Organisation.belongsTo(Utilisateur, { foreignKey: 'utilisateurId' });

Utilisateur.hasOne(PostePolice, { foreignKey: 'utilisateurId', onDelete: 'CASCADE' });
PostePolice.belongsTo(Utilisateur, { foreignKey: 'utilisateurId' });

// Signalement
Citoyen.hasMany(Signalement, { foreignKey: 'citoyenId' });
Signalement.belongsTo(Citoyen, { foreignKey: 'citoyenId' });

Enfant.hasMany(Signalement, { foreignKey: 'enfantId' });
Signalement.belongsTo(Enfant, { foreignKey: 'enfantId' });

PostePolice.hasMany(Signalement, { foreignKey: 'postePoliceId' });
Signalement.belongsTo(PostePolice, { foreignKey: 'postePoliceId' });

Utilisateur.hasMany(Notification, { foreignKey: 'utilisateurId' });
Notification.belongsTo(Utilisateur, { foreignKey: 'utilisateurId' });

// Message lié à un signalement, avec expéditeur et destinataire (Utilisateur)
Signalement.hasMany(Message, { foreignKey: 'signalementId' });
Message.belongsTo(Signalement, { foreignKey: 'signalementId' });

Utilisateur.hasMany(Message, { as: 'MessagesEnvoyes', foreignKey: 'expediteurId' });
Message.belongsTo(Utilisateur, { as: 'Expediteur', foreignKey: 'expediteurId' });

Utilisateur.hasMany(Message, { as: 'MessagesRecus', foreignKey: 'destinataireId' });
Message.belongsTo(Utilisateur, { as: 'Destinataire', foreignKey: 'destinataireId' });

PostePolice.hasMany(RechercheFaciale, { foreignKey: 'postePoliceId' });
RechercheFaciale.belongsTo(PostePolice, { foreignKey: 'postePoliceId' });

RechercheFaciale.hasMany(ResultatRecherche, { foreignKey: 'rechercheFacialeId' });
ResultatRecherche.belongsTo(RechercheFaciale, { foreignKey: 'rechercheFacialeId' });

Enfant.hasMany(ResultatRecherche, { foreignKey: 'enfantId' });
ResultatRecherche.belongsTo(Enfant, { foreignKey: 'enfantId' });



module.exports = {
  sequelize,
  Utilisateur,
  Citoyen,
  Administrateur,
  Organisation,
  PostePolice,
  Enfant,
  Signalement,
  Notification,
  Message,
  RechercheFaciale, 
  ResultatRecherche,
};