const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/authMiddleware');

// Middleware d'authentification et de vérification de rôle Admin
const adminCheck = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ msg: 'Accès réservé aux administrateurs' });
    }
};

router.use(authMiddleware);
router.use(adminCheck);

// Routes pour administrateur

// Get : /api/admin/restau : Lister les restau.
router.get('/restau', adminController.getAllRestaus);

// Put : /api/admin/restau/:id/validate : valider restau
router.put('/restau/:id/validate', adminController.validateRestau);

// Delete : /api/admin/restau/:id : Supprimer restau
router.delete('/restau/:id', adminController.deleteRestau);

module.exports = router;
