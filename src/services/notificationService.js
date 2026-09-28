const { Notification, Utilisateur } = require('../models');

const notifier = async (utilisateurId, titre, contenu) => {
  return Notification.create({ utilisateurId, titre, contenu });
};

const notifierTousLesCitoyens = async (titre, contenu) => {
  const citoyens = await Utilisateur.findAll({ where: { role: 'citoyen' } });
  await Promise.all(citoyens.map((c) => notifier(c.id, titre, contenu)));
};

const notifierPostePolice = async (postePoliceId, titre, contenu) => {
  const { PostePolice } = require('../models');
  const poste = await PostePolice.findByPk(postePoliceId);
  if (poste) await notifier(poste.utilisateurId, titre, contenu);
};

const notifierOrganisations = async (titre, contenu) => {
  const organisations = await Utilisateur.findAll({ where: { role: 'organisation' } });
  await Promise.all(organisations.map((o) => notifier(o.id, titre, contenu)));
};

module.exports = { notifier, notifierTousLesCitoyens, notifierPostePolice, notifierOrganisations };
