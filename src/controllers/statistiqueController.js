const { Signalement, Utilisateur, Citoyen, RechercheFaciale, ResultatRecherche } = require('../models');

const obtenirStatistiques = async (req, res) => {
  try {
    const [
      totalSignalements, totalDisparitions, totalRetrouvailles,
      enAttente, valide, rejete, publie, cloture,
      totalRecherches, recherchesVerifiees,
    ] = await Promise.all([
      Signalement.count(),
      Signalement.count({ where: { type: 'DISPARITION' } }),
      Signalement.count({ where: { type: 'RETROUVAILLE' } }),
      Signalement.count({ where: { statut: 'EN_ATTENTE' } }),
      Signalement.count({ where: { statut: 'VALIDE' } }),
      Signalement.count({ where: { statut: 'REJETE' } }),
      Signalement.count({ where: { statut: 'PUBLIE' } }),
      Signalement.count({ where: { statut: 'CLOTURE' } }),
      RechercheFaciale.count(),
      ResultatRecherche.count({ where: { verified: true } }),
    ]);

    const reponse = {
      signalements: {
        total: totalSignalements,
        disparitions: totalDisparitions,
        retrouvailles: totalRetrouvailles,
        parStatut: { enAttente, valide, rejete, publie, cloture },
      },
      rechercheFaciale: {
        total: totalRecherches,
        correspondancesTrouvees: recherchesVerifiees,
      },
    };

    // Données internes réservées à l'administrateur uniquement
    if (req.user.role === 'administrateur') {
      const [totalCitoyens, totalPostesPolice, totalOrganisations, cniEnAttente] = await Promise.all([
        Utilisateur.count({ where: { role: 'citoyen' } }),
        Utilisateur.count({ where: { role: 'poste_police' } }),
        Utilisateur.count({ where: { role: 'organisation' } }),
        Citoyen.count({ where: { statutVerificationCNI: 'EN_ATTENTE' } }),
      ]);
      reponse.utilisateurs = { citoyens: totalCitoyens, postesPolice: totalPostesPolice, organisations: totalOrganisations };
      reponse.cniEnAttente = cniEnAttente;
    }

    return res.json(reponse);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { obtenirStatistiques };