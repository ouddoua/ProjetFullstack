const Restau = require('../models/Restau');

// @desc    Lister tous les restaus (avec optionnel filtre status)
// @route   GET /api/admin/restau
// @access  Privé (Admin)
exports.getAllRestaus = async (req, res) => {
    try {
        const restaus = await Restau.find().populate('owner', ['nom', 'email']);
        res.json(restaus);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// @desc    Valider un restau
// @route   PUT /api/admin/restau/:id/validate
// @access  Privé (Admin)
exports.validateRestau = async (req, res) => {
    try {
        let restau = await Restau.findById(req.params.id);
        if (!restau) {
            return res.status(404).json({ msg: 'Restaurant non trouvé' });
        }

        restau.status = 'valide';
        await restau.save();

        res.json(restau);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// @desc    Supprimer un restau
// @route   DELETE /api/admin/restau/:id
// @access  Privé (Admin)
exports.deleteRestau = async (req, res) => {
    try {
        // Optionnel: Supprimer aussi les réservations associées ? Pour l'instant on supprime juste le restau.
        const restau = await Restau.findByIdAndDelete(req.params.id);
        if (!restau) {
            return res.status(404).json({ msg: 'Restaurant non trouvé' });
        }

        res.json({ msg: 'Restaurant supprimé' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};
