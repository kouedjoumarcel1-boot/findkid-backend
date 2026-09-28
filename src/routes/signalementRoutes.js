const express = require('express');
const router = express.Router();
const verifierToken = require('../middlewares/authMiddleware');
const autoriserRoles = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/upload');
const {
  creerDisparition, creerRetrouvaille, listerSignalements, obtenirSignalement,
  confirmerRecuperation, mesSignalements, listerSignalementsOrganisation,
} = require('../controllers/signalementController');

router.get('/', listerSignalements);
router.get('/citoyen/mes-signalements', verifierToken, autoriserRoles('citoyen'), mesSignalements);
router.get('/organisation/tous', verifierToken, autoriserRoles('organisation', 'administrateur'), listerSignalementsOrganisation);
router.get('/:id', obtenirSignalement);
router.post('/disparition', verifierToken, autoriserRoles('citoyen'), upload.single('photo'), creerDisparition);
router.post('/retrouvaille', verifierToken, autoriserRoles('citoyen'), upload.single('photo'), creerRetrouvaille);
router.put('/:id/confirmer-recuperation', verifierToken, autoriserRoles('citoyen'), confirmerRecuperation);

module.exports = router;