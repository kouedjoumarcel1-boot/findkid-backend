const bcrypt = require('bcryptjs');
const { Utilisateur, PostePolice, Signalement, Enfant } = require('../models');

const creerPostePolice = async (req, res) => {
  try {
    const { nom, prenom, email, telephone, motDePasse, nomPoste, ville, quartier } = req.body;

    if (!nom || !prenom || !email || !telephone || !motDePasse || !nomPoste || !ville || !quartier) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const existant = await Utilisateur.findOne({ where: { email } });
    if (existant) return res.status(409).json({ message: 'Cet email est déjà utilisé' });

    const motDePasseHash = await bcrypt.hash(motDePasse, 10);

    const utilisateur = await Utilisateur.create({
      nom, prenom, email, telephone,
      motDePasse: motDePasseHash,
      role: 'poste_police',
    });

    const poste = await PostePolice.create({
      utilisateurId: utilisateur.id,
      nomPoste, ville, quartier,
    });

    return res.status(201).json({ message: 'Poste de police créé', poste });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const listerPostesPolice = async (req, res) => {
  try {
    const postes = await PostePolice.findAll({
      include: [{ model: Utilisateur, attributes: { exclude: ['motDePasse'] } }],
    });
    return res.json(postes);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const modifierPostePolice = async (req, res) => {
  try {
    const poste = await PostePolice.findByPk(req.params.id);
    if (!poste) return res.status(404).json({ message: 'Introuvable' });

    const { nomPoste, ville, quartier } = req.body;
    if (nomPoste) poste.nomPoste = nomPoste;
    if (ville) poste.ville = ville;
    if (quartier) poste.quartier = quartier;
    await poste.save();

    return res.json({ message: 'Poste de police mis à jour', poste });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Signalements de la zone du poste connecté
const mesSignalements = async (req, res) => {
  try {
    const poste = await PostePolice.findOne({ where: { utilisateurId: req.user.id } });
    if (!poste) return res.status(403).json({ message: 'Réservé aux postes de police' });

    const { Citoyen } = require('../models');
    const signalements = await Signalement.findAll({
      where: { postePoliceId: poste.id },
      include: [Enfant, { model: Citoyen, attributes: ['id', 'utilisateurId'] }],
      order: [['createdAt', 'DESC']],
    });
    return res.json(signalements);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { creerPostePolice, listerPostesPolice, modifierPostePolice, mesSignalements };