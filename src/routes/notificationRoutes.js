const express = require('express');
const router = express.Router();
const verifierToken = require('../middlewares/authMiddleware');
const { mesNotifications, marquerLue, compterNonLues } = require('../controllers/notificationController');


router.use(verifierToken);
router.get('/', mesNotifications);
router.put('/:id/lue', marquerLue);
router.get('/non-lues/compteur', compterNonLues);

module.exports = router;