const express = require('express');
const router = express.Router();
const verifierToken = require('../middlewares/authMiddleware');
const autoriserRoles = require('../middlewares/roleMiddleware');
const { obtenirStatistiques } = require('../controllers/statistiqueController');

router.get('/', verifierToken, autoriserRoles('administrateur', 'organisation'), obtenirStatistiques);

module.exports = router;