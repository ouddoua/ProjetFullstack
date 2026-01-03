const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes client (Recherche et réservation)

// Get : /api/restau : Lister tous les restau actifs (validés). Public.
// Note: Le chemin monté dans app.js est /api, donc ça fera /api/restau
router.get('/restau', reservationController.getPublicRestaus);

// Get : /api/client/:id/plan : Obtenir le plan d'un restau pour la 3D
router.get('/client/:id/plan', reservationController.getRestauPlan);


// Post : /api/reservation : Créer une nouvelle réservation
router.post('/reservation', reservationController.createReservation);

// Get : /api/reservation/profil : Liste réservation des clients.
router.get('/reservation/profil', reservationController.getClientReservations);

module.exports = router;
