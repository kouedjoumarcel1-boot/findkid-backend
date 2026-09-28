const express = require('express');
const router = express.Router();
const verifierToken = require('../middlewares/authMiddleware');
const autoriserRoles = require('../middlewares/roleMiddleware');
const {
  creerPostePolice, listerPostesPolice, modifierPostePolice, mesSignalements,
} = require('../controllers/postePoliceController');

// Gestion admin
router.post('/', verifierToken, autoriserRoles('administrateur'), creerPostePolice);
router.get('/', verifierToken, autoriserRoles('administrateur'), listerPostesPolice);
router.put('/:id', verifierToken, autoriserRoles('administrateur'), modifierPostePolice);


// Espace poste de police
router.get('/signalements/zone', verifierToken, autoriserRoles('poste_police'), mesSignalements);

module.exports = router;