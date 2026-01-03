const Restau = require('../models/Restau');
const Reservation = require('../models/Reservation');


exports.getRestaus = async (req, res) => {
    try {
        const restaurants = await Restau.find({ status: 'valide' });
        //NE RENVOIE QUE LE TABLEAU. 
        //Ne mets pas de { message: "..." }, sinon .map() ne marchera pas.
        res.json(restaurants); 
    } catch (err) {
        res.status(500).json({ msg: "Erreur serveur" });
    }
};

// @desc    Créer ou mettre à jour le profil du restaurant
// @route   POST /api/restau/profil
// @access  Privé (Restaurateur)
exports.createOrUpdateProfile = async (req, res) => {
    const { nom, adresse, cuisine, description } = req.body;

    try {
        let restau = await Restau.findOne({ owner: req.user.id });

        if (restau) {
            // Update
            restau = await Restau.findOneAndUpdate(
                { owner: req.user.id },
                { $set: { nom, adresse, cuisine, description, status: 'valide' } }, 
                { new: true }
            );
            console.log("RESTAURANT MIS À JOUR EN BASE :", restau);
            return res.json(restau);
        }

        // Create
        restau = new Restau({
            owner: req.user.id,
            nom,
            adresse,
            cuisine,
            description,
            status: 'valide'
        });

        await restau.save();
        console.log("NOUVEAU RESTAURANT ENREGISTRÉ EN BASE :", restau);
    } catch (err) {
        console.error("ERREUR LORS DE L'ENREGISTREMENT :", err.message);
        res.status(500).json({ msg: 'Erreur serveur' });
    }
    };


// @desc    Récupérer les infos du profil restaurant
// @route   GET /api/restau/profil
// @access  Privé (Restaurateur)
exports.getProfile = async (req, res) => {
    try {
        // Sécurité supplémentaire
        if (!req.user) {
            return res.status(401).json({ msg: 'Non autorisé, token manquant' });
        }

        const restau = await Restau.findOne({ owner: req.user.id });
        
        if (!restau) {
            // Renvoyer 404 est normal pour un nouveau restaurateur
            return res.status(404).json({ msg: 'Aucun restaurant trouvé' });
        }
        
        res.json(restau);
    } catch (err) {
        console.error("ERREUR PROFIL:", err.message);
        res.status(500).json({ msg: 'Erreur serveur' });
    }
};
// @desc    Mettre à jour le plan (tables) du restaurant
// @route   PUT /api/restau/plan
// @access  Privé (Restaurateur)
exports.updatePlan = async (req, res) => {
    const { tables } = req.body; // Array of table objects

    try {
        const restau = await Restau.findOne({ owner: req.user.id });
        if (!restau) {
            return res.status(404).json({ msg: 'Restaurant non trouvé' });
        }

        restau.tables = tables;
        await restau.save();

        res.json(restau);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// @desc    Récupérer toutes les réservations pour ce restaurant
// @route   GET /api/restau/profil/reservation
// @access  Privé (Restaurateur)
exports.getRestauReservations = async (req, res) => {
    try {
        const restau = await Restau.findOne({ owner: req.user.id });
        if (!restau) {
            return res.status(404).json({ msg: 'Restaurant non trouvé' });
        }

        const reservations = await Reservation.find({ restau: restau.id })
            .populate('user', ['nom', 'email', 'telephone']);

        res.json(reservations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// @desc    Modifier le statut d'une réservation
// @route   PUT /api/restau/reservation/:id/status
// @access  Privé (Restaurateur)
exports.updateReservationStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ msg: 'Réservation non trouvée' });
        }

        // Vérifier que la réservation appartient bien au restaurant du user connecté
        const restau = await Restau.findOne({ owner: req.user.id });
        if (!restau || reservation.restau.toString() !== restau.id) {
            return res.status(401).json({ msg: 'Non autorisé' });
        }

        reservation.status = status;
        await reservation.save();

        res.json(reservation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};
