const { Signalement, Enfant, Citoyen, Utilisateur } = require('../models');
const { notifier, notifierTousLesCitoyens, notifierPostePolice, notifierOrganisations } = require('../services/notificationService');
const listerEnAttente = async (req, res) => {
  try {
    const signalements = await Signalement.findAll({
      where: { statut: 'EN_ATTENTE' },
      include: [Enfant],
      order: [['createdAt', 'ASC']],
    });
    return res.json(signalements);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const validerSignalement = async (req, res) => {
  try {
    const signalement = await Signalement.findByPk(req.params.id, { include: [Citoyen] });
    if (!signalement) return res.status(404).json({ message: 'Introuvable' });
    if (signalement.statut !== 'EN_ATTENTE') {
      return res.status(400).json({ message: 'Ce signalement a déjà été traité' });
    }

    signalement.statut = 'PUBLIE';
    await signalement.save();

    const citoyen = await Citoyen.findByPk(signalement.citoyenId);
    const typeTexte = signalement.type === 'DISPARITION' ? 'disparition' : 'enfant retrouvé';

    await notifier(citoyen.utilisateurId, 'Signalement validé', `Votre signalement de ${typeTexte} a été validé et publié.`);
    await notifierTousLesCitoyens('Nouveau signalement', `Un nouveau signalement de ${typeTexte} a été publié.`);
    if (signalement.postePoliceId) {
      await notifierPostePolice(signalement.postePoliceId, 'Nouveau signalement dans votre zone', `Un signalement de ${typeTexte} concerne votre zone.`);
    }
    if (signalement.type === 'DISPARITION') {
      await notifierOrganisations(
        'Alerte disparition',
        `Un nouveau signalement de disparition a été publié. Consultez l'espace Organisation pour le détail.`
      );
    }

    return res.json({ message: 'Signalement validé et publié', signalement });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const rejeterSignalement = async (req, res) => {
  try {
    const { motif } = req.body;
    if (!motif) return res.status(400).json({ message: 'Un motif de rejet est requis' });

    const signalement = await Signalement.findByPk(req.params.id);
    if (!signalement) return res.status(404).json({ message: 'Introuvable' });
    if (signalement.statut !== 'EN_ATTENTE') {
      return res.status(400).json({ message: 'Ce signalement a déjà été traité' });
    }

    signalement.statut = 'REJETE';
    signalement.motifRejet = motif;
    await signalement.save();

    const citoyen = await Citoyen.findByPk(signalement.citoyenId);
    await notifier(citoyen.utilisateurId, 'Signalement rejeté', `Votre signalement a été rejeté. Motif : ${motif}`);

    return res.json({ message: 'Signalement rejeté', signalement });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const listerTousSignalements = async (req, res) => {
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

const activerSignalement = async (req, res) => {
  try {
    const signalement = await Signalement.findByPk(req.params.id);
    if (!signalement) return res.status(404).json({ message: 'Introuvable' });
    signalement.actif = true;
    await signalement.save();
    return res.json({ message: 'Signalement activé', signalement });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const desactiverSignalement = async (req, res) => {
  try {
    const signalement = await Signalement.findByPk(req.params.id);
    if (!signalement) return res.status(404).json({ message: 'Introuvable' });
    signalement.actif = false;
    await signalement.save();
    return res.json({ message: 'Signalement désactivé', signalement });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const supprimerSignalement = async (req, res) => {
  try {
    const signalement = await Signalement.findByPk(req.params.id);
    if (!signalement) return res.status(404).json({ message: 'Introuvable' });
    signalement.statut = 'SUPPRIME';
    signalement.actif = false;
    await signalement.save();
    return res.json({ message: 'Signalement supprimé', signalement });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = {
  listerEnAttente, validerSignalement, rejeterSignalement,
  listerTousSignalements, activerSignalement, desactiverSignalement, supprimerSignalement,
};