const express = require('express');
const router = express.Router();
const verifierToken = require('../middlewares/authMiddleware');
const autoriserRoles = require('../middlewares/roleMiddleware');
const {
  listerEnAttente, validerSignalement, rejeterSignalement,
  listerTousSignalements, activerSignalement, desactiverSignalement, supprimerSignalement,
} = require('../controllers/adminController');

router.use(verifierToken, autoriserRoles('administrateur'));

router.get('/signalements/en-attente', listerEnAttente);
router.get('/signalements/tous', listerTousSignalements);
router.put('/signalements/:id/valider', validerSignalement);
router.put('/signalements/:id/rejeter', rejeterSignalement);
router.put('/signalements/:id/activer', activerSignalement);
router.put('/signalements/:id/desactiver', desactiverSignalement);
router.put('/signalements/:id/supprimer', supprimerSignalement);

module.exports = router;