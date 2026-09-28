const express = require('express');
const router = express.Router();
const verifierToken = require('../middlewares/authMiddleware');
const autoriserRoles = require('../middlewares/roleMiddleware');
const {
  listerUtilisateurs, creerUtilisateur, modifierUtilisateur, changerStatutUtilisateur,
} = require('../controllers/utilisateurController');

router.use(verifierToken, autoriserRoles('administrateur'));
router.get('/', listerUtilisateurs);
router.post('/', creerUtilisateur);
router.put('/:id', modifierUtilisateur);
router.put('/:id/statut', changerStatutUtilisateur);

module.exports = router;