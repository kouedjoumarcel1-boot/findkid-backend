const path = require('path');
const { Citoyen, Utilisateur } = require('../models');

const listerCniEnAttente = async (req, res) => {
  try {
    const citoyens = await Citoyen.findAll({
      where: { statutVerificationCNI: 'EN_ATTENTE' },
      include: [{ model: Utilisateur, attributes: { exclude: ['motDePasse'] } }],
    });
    return res.json(citoyens);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Sert l'image de la CNI uniquement à un admin authentifié
const voirCni = async (req, res) => {
  try {
    const citoyen = await Citoyen.findByPk(req.params.id);
    if (!citoyen) return res.status(404).json({ message: 'Introuvable' });

    const cheminAbsolu = path.resolve(citoyen.cheminCNI);
    return res.sendFile(cheminAbsolu);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const verifierCni = async (req, res) => {
  try {
    const { statut } = req.body; // 'VERIFIEE' ou 'REJETEE'
    if (!['VERIFIEE', 'REJETEE'].includes(statut)) {
      return res.status(400).json({ message: "statut doit être VERIFIEE ou REJETEE" });
    }

    const citoyen = await Citoyen.findByPk(req.params.id);
    if (!citoyen) return res.status(404).json({ message: 'Introuvable' });

    citoyen.statutVerificationCNI = statut;
    await citoyen.save();

    return res.json({ message: `CNI marquée comme ${statut}`, citoyen });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { listerCniEnAttente, voirCni, verifierCni };