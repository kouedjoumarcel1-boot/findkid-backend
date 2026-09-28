const express = require('express');
const router = express.Router();
const { register, login, me, modifierProfil} = require('../controllers/authController');
const upload = require('../middlewares/upload');
const verifierToken = require('../middlewares/authMiddleware');

router.post('/register', upload.single('cni'), register);
router.post('/login', login);
router.get('/me', verifierToken, me);
router.put('/moi', verifierToken, modifierProfil);

module.exports = router;