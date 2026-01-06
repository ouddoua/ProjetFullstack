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
    // !! IMPORTANT !! : req.user est injecté via le middleware authMiddleware ?
    // Vérifions d'abord si req.user existe. Si la route n'est pas protégée dans routes/reservation.routes.js, req.user sera undefined.
    // D'après routes/reservation.routes.js, il n'y a PAS de authMiddleware sur createReservation !
    // Il faut le rajouter dans la route ou gérer ici.

    // TEMPORAIRE : Si pas d'auth, on refuse ou on simule (mais pour la BD c'est critique)
    // Comme le frontend envoie un token, on DOIT activer le middleware sur la route.
    // MAIS, si je ne peux pas toucher les routes facilement, je vérifie ici.

    // Ah, je vois que req.user est utilisé ligne 44 : req.user.id. Si authMiddleware manque, ça crash.
    // Donc l'erreur "ne s'enregistre pas" est peut-être un crash ici.

    console.log(">> POST /api/reservation - Body:", req.body);

    if (!req.user) {
        console.error("ERREUR: Utilisateur non authentifié (req.user manquant)");
        return res.status(401).json({ msg: "Vous devez être connecté pour réserver." });
    }

    const { restauId, tableId, dateTime, durationMinutes, numberOfGuests } = req.body;

    try {
        // --- ÉTAPE A : RE-VÉRIFICATION DE DISPONIBILITÉ (Très important) ---
        const start = new Date(dateTime);
        const end = new Date(start.getTime() + durationMinutes * 60000);

        console.log(`Checking availability for table ${tableId} from ${start.toISOString()} to ${end.toISOString()}`);

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
            console.warn("Conflit trouvé:", conflict);
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
        console.log("Reservation saved:", reservation._id);
        res.json(reservation);
    } catch (err) {
        console.error("Create Reservation Error:", err);
        res.status(500).send('Erreur serveur: ' + err.message);
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
            .select('nom adresse openingHours plan planImage')
            .populate('plan'); // Populate the linked Plan document

        if (!restau) return res.status(404).json({ msg: 'Restaurant non trouvé' });

        // Retrieve image from the Plan model preference, fallback to Restau legacy field
        const planImage = (restau.plan && restau.plan.imageUrl) ? restau.plan.imageUrl : restau.planImage;

        // Récupérer les tables
        const Table = require('../models/Table');
        const TablePosition = require('../models/TablePosition');

        // 1. Récupérer les tables
        const tables = await Table.find({ restau: restau._id });

        // 2. Récupérer les positions
        // Use the plan ID if available, otherwise we might miss positions linked to the plan
        const planId = restau.plan ? restau.plan._id : null;

        let positions = [];
        if (planId) {
            positions = await TablePosition.find({ plan: planId });
        } else {
            // Fallback if no plan linked but tables exist (legacy)
            positions = await TablePosition.find({ table: { $in: tables.map(t => t._id) } });
        }

        // Assemblage des données pour le frontend
        const tablesWithPos = tables.map(t => {
            // Find position for this table
            const pos = positions.find(p => p.table.toString() === t._id.toString());
            return {
                _id: t._id, // Standard ID
                tableId: t._id, // Legacy support
                tableNumber: t.tableNumber,
                capacity: t.capacity,
                isAvailable: t.isAvailable, // Pass original boolean
                status: t.isAvailable ? 'available' : 'unavailable', // Derived status
                x: pos ? pos.x : 50, // Default to visible area
                y: pos ? pos.y : 50,
                rotation: pos ? pos.rotation : 0,
                shape: 'rect' // Default shape if not stored
            };
        });

        res.json({
            plan: { // Wrap in plan object to match structure expected by PlanViewer if needed, or flat
                imageUrl: planImage || "",
                name: restau.plan ? restau.plan.name : "Plan"
            },
            planImage: planImage || "", // Legacy support
            tables: tablesWithPos,
            positions: tablesWithPos // Legacy support
        });

    } catch (err) {
        console.error("Error in getRestauPlan:", err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Restaurant non trouvé' });
        }
        res.status(500).send('Erreur serveur');
    }
};
