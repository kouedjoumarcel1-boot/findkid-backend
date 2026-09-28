const express = require('express');
const router = express.Router();
const verifierToken = require('../middlewares/authMiddleware');
const { envoyerMessage, listerMessages } = require('../controllers/messageController');

router.use(verifierToken);
router.post('/', envoyerMessage);
router.get('/', listerMessages);

module.exports = router;