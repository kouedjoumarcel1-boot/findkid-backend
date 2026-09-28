const { Notification } = require('../models');

const mesNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { utilisateurId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    return res.json(notifications);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const marquerLue = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, utilisateurId: req.user.id },
    });
    if (!notification) return res.status(404).json({ message: 'Introuvable' });
    notification.lue = true;
    await notification.save();
    return res.json(notification);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const compterNonLues = async (req, res) => {
  try {
    const total = await Notification.count({
      where: { utilisateurId: req.user.id, lue: false },
    });
    return res.json({ total });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { mesNotifications, marquerLue, compterNonLues };