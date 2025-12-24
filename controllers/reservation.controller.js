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
<<<<<<< Updated upstream
=======
        // --- ÉTAPE A : RE-VÉRIFICATION DE DISPONIBILITÉ (Très important) ---
        const start = new Date(dateTime);
        const end = new Date(start.getTime() + durationMinutes * 60000);

        // Vérifier si la table spécifiée est libre sur ce créneau
        const conflict = await Reservation.findOne({
            table: tableId,
            status: { $in: ['attente', 'confirme'] },
            $or: [
                { dateTime: { $lt: end, $gte: start } }, // Commence pendant
                { dateTime: { $lte: start }, $expr: { $gt: [{ $add: ['$dateTime', { $multiply: ['$durationMinutes', 60000] }] }, start] } } // Finit après le début
            ]
        });

        if (conflict) {
            return res.status(400).json({ msg: "Désolé, cette table a été réservée entre-temps." });
        }

        // --- ÉTAPE B : CRÉATION ---
>>>>>>> Stashed changes
        const newReservation = new Reservation({
            user: req.user.id,
            restau: restauId,
<<<<<<< Updated upstream
            date,
            heure,
            nb_personnes
=======
            dateTime: start,
            durationMinutes: durationMinutes,
            numberOfGuests: numberOfGuests,
            table: tableId,
            status: 'attente' // Par défaut
>>>>>>> Stashed changes
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
