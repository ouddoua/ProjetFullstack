const express = require('express');
const router = express.Router();
const restauController = require('../controllers/restau.controller');
const planController = require('../controllers/plan.controller');
const authMiddleware = require('../middlewares/authMiddleware');


// --- 1. ROUTE PUBLIQUE (Pour Home.jsx) ---
// Cette route doit être AVANT les middlewares de protection
router.get('/', restauController.getRestaus);
router.get('/public/:restauId/plan', planController.getPlan);

// Middleware pour toutes ces routes, car dédiées au restaurateur connecté
router.use(authMiddleware);

// Routes pour profil (Restau)
// POST /api/restau/profil : créer/mettre à jour les infos du profil
router.post('/profil', restauController.createOrUpdateProfile);

// GET /api/restau/profil : récupérer les infos du profil
router.get('/profil', restauController.getProfile);

// PLAN ROUTES
router.post('/plan/upload', planController.uploadPlanImage);
router.post('/plan', planController.savePlan);
router.get('/plan', planController.getPlan);

// PUT /api/restau/plan : gérer le plan du restau (tables)
// router.put('/plan', restauController.updatePlan); // Deprecated by planController.savePlan

// Routes de réservations (côté restau)
// Get : /api/restau/profil/reservation : récupérer toutes les réservations
router.get('/profil/reservation', restauController.getRestauReservations);

// Put : /api/restau/reservation/:id/status : Modifier le statut d'une réservation
router.put('/reservation/:id/status', restauController.updateReservationStatus);

module.exports = router;
