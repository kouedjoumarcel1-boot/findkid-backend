const { Message, Signalement, Citoyen } = require('../models');

const envoyerMessage = async (req, res) => {
  try {
    const { signalementId, destinataireId, contenu } = req.body;
    if (!signalementId || !destinataireId || !contenu) {
      return res.status(400).json({ message: 'signalementId, destinataireId et contenu sont requis' });
    }

    const signalement = await Signalement.findByPk(signalementId);
    if (!signalement) return res.status(404).json({ message: 'Signalement introuvable' });

    const message = await Message.create({
      signalementId,
      expediteurId: req.user.id,
      destinataireId,
      contenu,
    });

    return res.status(201).json({ message: 'Message envoyé', data: message });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const listerMessages = async (req, res) => {
  try {
    const { signalementId } = req.query;
    const { Op } = require('sequelize');
    const { Signalement, Enfant } = require('../models');

    const where = {};
    if (signalementId) where.signalementId = signalementId;

    const messages = await Message.findAll({
      where: {
        ...where,
        [Op.or]: [
          { expediteurId: req.user.id },
          { destinataireId: req.user.id },
        ],
      },
      include: [{ model: Signalement, include: [Enfant] }],
      order: [['createdAt', 'ASC']],
    });

    return res.json(messages);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { envoyerMessage, listerMessages };