const { RechercheFaciale, ResultatRecherche, Enfant, Signalement, PostePolice } = require('../models');
const { rechercherCorrespondance } = require('../services/deepfaceService');

const lancerRecherche = async (req, res) => {
  try {
    const poste = await PostePolice.findOne({ where: { utilisateurId: req.user.id } });
    if (!poste) return res.status(403).json({ message: 'Réservé aux postes de police' });
    if (!req.file) return res.status(400).json({ message: 'Une photo est requise' });

    const recherche = await RechercheFaciale.create({
      postePoliceId: poste.id,
      photoRecherche: req.file.path,
      statut: 'EN_COURS',
    });

    // Enfants disparus actifs (signalement PUBLIE) avec un embedding calculé
    const enfants = await Enfant.findAll({
      where: { embeddingFacial: { [require('sequelize').Op.ne]: null } },
      include: [{
        model: Signalement,
        where: { type: 'DISPARITION', statut: 'PUBLIE' },
        required: true,
      }],
    });

    if (enfants.length === 0) {
      recherche.statut = 'TERMINEE';
      await recherche.save();
      return res.json({ recherche, resultats: [] });
    }

    const candidats = enfants.map((e) => ({ enfantId: e.id, embedding: e.embeddingFacial }));

    let resultats;
    try {
      resultats = await rechercherCorrespondance(req.file.path, candidats);
    } catch (err) {
      recherche.statut = 'ERREUR';
      await recherche.save();
      return res.status(500).json({ message: 'Erreur du service de reconnaissance faciale', error: err.message });
    }

    await Promise.all(resultats.map((r) => ResultatRecherche.create({
      rechercheFacialeId: recherche.id,
      enfantId: r.enfantId,
      distance: r.distance,
      seuil: r.seuil,
      verified: r.verified,
    })));

    recherche.statut = 'TERMINEE';
    await recherche.save();

    return res.json({ recherche, resultats });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const historiqueRecherches = async (req, res) => {
  try {
    const poste = await PostePolice.findOne({ where: { utilisateurId: req.user.id } });
    if (!poste) return res.status(403).json({ message: 'Réservé aux postes de police' });

    const recherches = await RechercheFaciale.findAll({
      where: { postePoliceId: poste.id },
      include: [ResultatRecherche],
      order: [['createdAt', 'DESC']],
    });
    return res.json(recherches);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { lancerRecherche, historiqueRecherches };