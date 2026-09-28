const express = require('express');
const router = express.Router();
const verifierToken = require('../middlewares/authMiddleware');
const autoriserRoles = require('../middlewares/roleMiddleware');
const { listerCniEnAttente, voirCni, verifierCni } = require('../controllers/citoyenController');

router.use(verifierToken, autoriserRoles('administrateur'));
router.get('/cni-en-attente', listerCniEnAttente);
router.get('/:id/cni', voirCni);
router.put('/:id/cni/verifier', verifierCni);

module.exports = router;