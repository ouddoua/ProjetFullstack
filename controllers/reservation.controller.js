const Restau = require('../models/Restau');
const Reservation = require('../models/Reservation');

// @desc    Lister tous les restau actifs (validés) pour la recherche (Public)
// @route   GET /api/restau (appellé via reservation.routes ou restau public)
// @access  Public
exports.getPublicRestaus = async (req, res) => {
    try {
        const restaus = await Restau.find({ status: 'valide' }).select('-owner');
        res.json(restaus);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// @desc    Créer une nouvelle réservation
// @route   POST /api/reservation
// @access  Privé (Client)
exports.createReservation = async (req, res) => {
    const { restauId, date, heure, nb_personnes } = req.body;

    try {
        const newReservation = new Reservation({
            user: req.user.id,
            restau: restauId,
            date,
            heure,
            nb_personnes
        });

        const reservation = await newReservation.save();
        res.json(reservation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// @desc    Liste réservation des clients
// @route   GET /api/reservation/profil
// @access  Privé (Client)
exports.getClientReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.user.id })
            .populate('restau', ['nom', 'adresse', 'telephone']);
        res.json(reservations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};
