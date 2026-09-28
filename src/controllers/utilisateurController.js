const bcrypt = require('bcryptjs');
const { Utilisateur, Citoyen, Administrateur, Organisation, PostePolice } = require('../models');

const listerUtilisateurs = async (req, res) => {
  try {
    const { role } = req.query;
    const where = {};
    if (role) where.role = role;

    const utilisateurs = await Utilisateur.findAll({
      where,
      attributes: { exclude: ['motDePasse'] },
      include: [
        { model: Organisation, required: false },
        { model: PostePolice, required: false },
      ],
      order: [['createdAt', 'DESC']],
    });
    return res.json(utilisateurs);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Création directe par l'admin : administrateur ou organisation (citoyen passe par /auth/register, poste_police par sa propre route)
const creerUtilisateur = async (req, res) => {
  try {
    const { nom, prenom, email, telephone, motDePasse, role, nomOrganisation, typeOrganisation } = req.body;

    if (!['administrateur', 'organisation'].includes(role)) {
      return res.status(400).json({ message: "role doit être administrateur ou organisation" });
    }
    if (!nom || !prenom || !email || !telephone || !motDePasse) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const existant = await Utilisateur.findOne({ where: { email } });
    if (existant) return res.status(409).json({ message: 'Cet email est déjà utilisé' });

    const motDePasseHash = await bcrypt.hash(motDePasse, 10);
    const utilisateur = await Utilisateur.create({ nom, prenom, email, telephone, motDePasse: motDePasseHash, role });

    if (role === 'administrateur') {
      await Administrateur.create({ utilisateurId: utilisateur.id });
    } else if (role === 'organisation') {
      if (!nomOrganisation) return res.status(400).json({ message: 'nomOrganisation requis' });
      await Organisation.create({ utilisateurId: utilisateur.id, nomOrganisation, typeOrganisation });
    }

    return res.status(201).json({ message: 'Utilisateur créé', utilisateur });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const modifierUtilisateur = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.params.id);
    if (!utilisateur) return res.status(404).json({ message: 'Introuvable' });

    const { nom, prenom, telephone } = req.body;
    if (nom) utilisateur.nom = nom;
    if (prenom) utilisateur.prenom = prenom;
    if (telephone) utilisateur.telephone = telephone;
    await utilisateur.save();

    return res.json({ message: 'Utilisateur mis à jour', utilisateur });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const changerStatutUtilisateur = async (req, res) => {
  try {
    const { statut } = req.body; // ACTIF | INACTIF | SUSPENDU
    if (!['ACTIF', 'INACTIF', 'SUSPENDU'].includes(statut)) {
      return res.status(400).json({ message: 'statut invalide' });
    }

    const utilisateur = await Utilisateur.findByPk(req.params.id);
    if (!utilisateur) return res.status(404).json({ message: 'Introuvable' });

    utilisateur.statutCompte = statut;
    await utilisateur.save();

    return res.json({ message: `Statut changé en ${statut}`, utilisateur });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { listerUtilisateurs, creerUtilisateur, modifierUtilisateur, changerStatutUtilisateur };