const express = require('express');
const router = express.Router();
const verifierToken = require('../middlewares/authMiddleware');
const autoriserRoles = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/upload');
const { lancerRecherche, historiqueRecherches } = require('../controllers/rechercheFacialeController');

router.use(verifierToken, autoriserRoles('poste_police'));
router.post('/', upload.single('photo'), lancerRecherche);
router.get('/', historiqueRecherches);

module.exports = router;