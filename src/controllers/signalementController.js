const { Signalement, Enfant, Citoyen, PostePolice } = require('../models');

// Détermine le poste de police responsable (logique simple ville+quartier)
const trouverPostePolice = async (ville, quartier) => {
  return PostePolice.findOne({ where: { ville, quartier } });
};

const { extraireEmbedding } = require('../services/deepfaceService');

const creerDisparition = async (req, res) => {
  try {
    const citoyen = await Citoyen.findOne({ where: { utilisateurId: req.user.id } });
    if (!citoyen) return res.status(403).json({ message: 'Réservé aux citoyens' });

    const {
      nom, prenom, intervalleAge, descriptionPhysique, description,
      circonstances, dateEvenement, lieu, ville, quartier, latitude, longitude,
    } = req.body;

    const enfant = await Enfant.create({
      nom, prenom, intervalleAge, descriptionPhysique,
      photo: req.file ? req.file.path : null,
    });

    // Calcul de l'embedding facial (non bloquant)
    if (req.file) {
      try {
        const embedding = await extraireEmbedding(req.file.path);
        enfant.embeddingFacial = embedding;
        await enfant.save();
      } catch (err) {
        console.error('Erreur extraction embedding:', err.message);
        // le signalement continue même si l'embedding échoue
      }
    }

    const postePolice = ville && quartier ? await trouverPostePolice(ville, quartier) : null;

    const signalement = await Signalement.create({
      type: 'DISPARITION',
      description, circonstances, dateEvenement, lieu,
      latitude: latitude || null,
      longitude: longitude || null,
      citoyenId: citoyen.id,
      enfantId: enfant.id,
      postePoliceId: postePolice ? postePolice.id : null,
    });

    return res.status(201).json({ message: 'Signalement créé, en attente de validation', signalement });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const creerRetrouvaille = async (req, res) => {
  try {
    const citoyen = await Citoyen.findOne({ where: { utilisateurId: req.user.id } });
    if (!citoyen) return res.status(403).json({ message: 'Réservé aux citoyens' });

    const {
      ageEstime, description, circonstances, dateEvenement,
      lieu, ville, quartier, latitude, longitude,
    } = req.body;

    const enfant = await Enfant.create({
      intervalleAge: ageEstime,
      descriptionPhysique: description,
      photo: req.file ? req.file.path : null,
    });

    const postePolice = ville && quartier ? await trouverPostePolice(ville, quartier) : null;

    const signalement = await Signalement.create({
      type: 'RETROUVAILLE',
      description,
      circonstances,
      dateEvenement,
      lieu,
      latitude: latitude || null,
      longitude: longitude || null,
      citoyenId: citoyen.id,
      enfantId: enfant.id,
      postePoliceId: postePolice ? postePolice.id : null,
    });

    return res.status(201).json({ message: 'Signalement créé, en attente de validation', signalement });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const listerSignalements = async (req, res) => {
  try {
    const { type, statut, ville } = req.query;
    const where = { actif: true };
    if (type) where.type = type;
    if (statut) where.statut = statut;
    else where.statut = 'PUBLIE';

    const { Op } = require('sequelize');
    if (ville) where.lieu = { [Op.like]: `%${ville}%` };

    const signalements = await Signalement.findAll({
      where,
      include: [Enfant],
      order: [['createdAt', 'DESC']],
    });
    return res.json(signalements);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const mesSignalements = async (req, res) => {
  try {
    const citoyen = await Citoyen.findOne({ where: { utilisateurId: req.user.id } });
    if (!citoyen) return res.status(403).json({ message: 'Réservé aux citoyens' });

    const signalements = await Signalement.findAll({
      where: { citoyenId: citoyen.id },
      include: [Enfant],
      order: [['createdAt', 'DESC']],
    });
    return res.json(signalements);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};



const obtenirSignalement = async (req, res) => {
  try {
    const signalement = await Signalement.findByPk(req.params.id, {
      include: [
        Enfant,
        { model: Citoyen, attributes: ['id', 'utilisateurId'] }, // pas cheminCNI ni statutVerificationCNI
      ],
    });
    if (!signalement) return res.status(404).json({ message: 'Introuvable' });
    return res.json(signalement);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const { notifierPostePolice } = require('../services/notificationService');

const confirmerRecuperation = async (req, res) => {
  try {
    const citoyen = await Citoyen.findOne({ where: { utilisateurId: req.user.id } });
    if (!citoyen) return res.status(403).json({ message: 'Réservé aux citoyens' });

    const signalement = await Signalement.findByPk(req.params.id);
    if (!signalement) return res.status(404).json({ message: 'Introuvable' });

    if (signalement.citoyenId !== citoyen.id) {
      return res.status(403).json({ message: "Vous n'êtes pas l'auteur de ce signalement" });
    }
    if (signalement.statut !== 'PUBLIE') {
      return res.status(400).json({ message: 'Seul un signalement publié peut être clôturé' });
    }

    signalement.statut = 'CLOTURE';
    await signalement.save();

    if (signalement.postePoliceId) {
      await notifierPostePolice(
        signalement.postePoliceId,
        'Récupération confirmée',
        `Le citoyen a confirmé la récupération de l'enfant pour le signalement #${signalement.id}.`
      );
    }

    return res.json({ message: 'Récupération confirmée, signalement clôturé', signalement });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const listerSignalementsOrganisation = async (req, res) => {
  try {
    const { statut, type } = req.query;
    const where = {};
    if (statut) where.statut = statut;
    if (type) where.type = type;

    const signalements = await Signalement.findAll({
      where,
      include: [Enfant],
      order: [['createdAt', 'DESC']],
    });
    return res.json(signalements);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = {
  creerDisparition, creerRetrouvaille, listerSignalements, obtenirSignalement,
  confirmerRecuperation, mesSignalements, listerSignalementsOrganisation,
};