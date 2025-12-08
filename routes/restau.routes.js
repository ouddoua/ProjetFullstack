const express = require('express');
const router = express.Router();
const restauController = require('../controllers/restau.controller');
const authMiddleware = require('../middlewares/authMiddleware');

// Middleware pour toutes ces routes, car dédiées au restaurateur connecté
router.use(authMiddleware);

// Routes pour profil (Restau)
// POST /api/restau/profil : créer/mettre à jour les infos du profil
router.post('/profil', restauController.createOrUpdateProfile);

// GET /api/restau/profil : récupérer les infos du profil
router.get('/profil', restauController.getProfile);

// PUT /api/restau/plan : gérer le plan du restau (tables)
router.put('/plan', restauController.updatePlan);

// Routes de réservations (côté restau)
// Get : /api/restau/profil/reservation : récupérer toutes les réservations
router.get('/profil/reservation', restauController.getRestauReservations);

// Put : /api/restau/reservation/:id/status : Modifier le statut d'une réservation
router.put('/reservation/:id/status', restauController.updateReservationStatus);

module.exports = router;
