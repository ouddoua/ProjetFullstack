const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes d'authentification

// POST /api/auth/register : créer un compte client / Restau
router.post('/register', authController.register);

// POST /api/auth/login : authentifier utilisateur(client/Restau)
router.post('/login', authController.login);

// GET /api/auth/profil : Récupérer les infos du profil utilisateur
router.get('/profil', authMiddleware, authController.getProfile);

// GET /api/auth/logout : déconnexion (client/Restau)
router.get('/logout', authController.logout);

module.exports = router;
