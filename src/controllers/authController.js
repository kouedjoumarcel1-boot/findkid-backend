const bcrypt = require('bcryptjs');
const { Utilisateur, Citoyen } = require('../models');
const { genererToken } = require('../utils/jwt');

const register = async (req, res) => {
  try {
    const { nom, prenom, email, telephone, motDePasse } = req.body;

    if (!nom || !prenom || !email || !telephone || !motDePasse) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'La CNI est obligatoire' });
    }

    const existant = await Utilisateur.findOne({ where: { email } });
    if (existant) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }

    const motDePasseHash = await bcrypt.hash(motDePasse, 10);

    const utilisateur = await Utilisateur.create({
      nom, prenom, email, telephone,
      motDePasse: motDePasseHash,
      role: 'citoyen',
    });

    await Citoyen.create({
      utilisateurId: utilisateur.id,
      cheminCNI: req.file.path,
    });

    const token = genererToken(utilisateur);

    return res.status(201).json({
      message: 'Inscription réussie',
      token,
      utilisateur: { id: utilisateur.id, nom, prenom, email, role: 'citoyen' },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const modifierProfil = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.user.id);
    if (!utilisateur) return res.status(404).json({ message: 'Introuvable' });

    const { nom, prenom, telephone, motDePasseActuel, nouveauMotDePasse } = req.body;

    if (nom) utilisateur.nom = nom;
    if (prenom) utilisateur.prenom = prenom;
    if (telephone) utilisateur.telephone = telephone;

    if (nouveauMotDePasse) {
      if (!motDePasseActuel) {
        return res.status(400).json({ message: 'Le mot de passe actuel est requis pour le changer' });
      }
      const valide = await bcrypt.compare(motDePasseActuel, utilisateur.motDePasse);
      if (!valide) return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
      utilisateur.motDePasse = await bcrypt.hash(nouveauMotDePasse, 10);
    }

    await utilisateur.save();

    const { motDePasse, ...utilisateurSansMdp } = utilisateur.toJSON();
    return res.json({ message: 'Profil mis à jour', utilisateur: utilisateurSansMdp });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};



const login = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    if (!email || !motDePasse) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const utilisateur = await Utilisateur.findOne({ where: { email } });
    if (!utilisateur) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
    if (utilisateur.statutCompte !== 'ACTIF') {
      return res.status(403).json({ message: 'Compte inactif ou suspendu' });
    }

    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!motDePasseValide) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const token = genererToken(utilisateur);

    return res.json({
      message: 'Connexion réussie',
      token,
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
const me = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.user.id, {
      attributes: { exclude: ['motDePasse'] },
    });
    if (!utilisateur) return res.status(404).json({ message: 'Utilisateur introuvable' });
    return res.json(utilisateur);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { register, login, me, modifierProfil };
