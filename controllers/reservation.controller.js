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
    const { restauId, tableId, dateTime, durationMinutes, numberOfGuests } = req.body;

    try {
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
        const newReservation = new Reservation({
            user: req.user.id,
            restau: restauId,
            dateTime: start,
            durationMinutes: durationMinutes,
            numberOfGuests: numberOfGuests,
            table: tableId,
            status: 'attente' // Par défaut
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

// @desc    Obtenir le plan (tables) et infos de base d'un restau pour le client (Public)
// @route   GET /api/client/:id/plan
// @access  Public
exports.getRestauPlan = async (req, res) => {
    try {
        const restau = await Restau.findById(req.params.id)
            .select('nom adresse openingHours planImage'); // + planImage si on l'ajoute au schéma Restau ou Plan

        if (!restau) return res.status(404).json({ msg: 'Restaurant non trouvé' });

        // Récupérer les tables (soit via Plan.tables, soit Table.find({ restau: id }))
        // Comme on a migré vers un modèle Table séparé :
        const Table = require('../models/Table');
        const TablePosition = require('../models/TablePosition');

        // 1. Récupérer les tables
        const tables = await Table.find({ restau: restau._id });

        // 2. Récupérer les positions (optionnel, sinon on génère ou on prend celles par défaut)
        // Pour l'instant, on suppose que les tables ont des coordonnées (si on a fusionné ou si on fait une jointure virtuelle)
        // Mais TablePosition est séparé.
        const positions = await TablePosition.find({ table: { $in: tables.map(t => t._id) } });

        // Assemblage des données pour le frontend 3D
        const tablesWithPos = tables.map(t => {
            const pos = positions.find(p => p.table.toString() === t._id.toString());
            return {
                tableId: t._id,
                tableNumber: t.tableNumber,
                capacity: t.capacity,
                status: t.isAvailable ? 'available' : 'unavailable', // Statut de base (libéré par défaut)
                // Coord ou défaut
                x: pos ? pos.x : 100,
                y: pos ? pos.y : 100,
                rotation: pos ? pos.rotation : 0
            };
        });

        // TODO: Vérifier la disponibilité (est-ce que la table est réservée CE SOIR ?)
        // Pour simplifier l'instant T, on renvoie juste la structure.
        // Le frontend fait un 2ème appel CHECK DISPO ou on le fait ici si on avait la date.

        res.json({
            planImage: restau.planImage || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000&auto=format&fit=crop",
            positions: tablesWithPos
        });

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Restaurant non trouvé' });
        }
        res.status(500).send('Erreur serveur');
    }
};
