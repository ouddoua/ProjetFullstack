// Fichier : controllers/clientController.js

const Restaurant = require('../models/Restau');
const Plan = require('../models/Plan');
const Table = require('../models/Table'); // Nécessaire pour les requêtes complexes
const TablePosition = require('../models/TablePosition');
const Reservation = require('../models/Reservation');

// @desc    Lister tous les restaurants ACTIFS (validés par l'Admin)
// @route   GET /api/restau
// @access  Public
exports.listValidatedRestaurants = async (req, res) => {
    try {
        // Filtrage des restaurants validés
        const restaurants = await Restaurant.find({ status: 'valide' })
            .select('-owner -status -plan -createdAt -updatedAt'); // Exclure les champs internes

        // Note: Ici vous pouvez ajouter la logique de filtrage par req.query (cuisine, ville, etc.)

        res.json(restaurants);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur lors de la récupération des restaurants.');
    }
};


// @desc    Récupérer le plan de salle actif pour un restaurant donné
// @route   GET /api/restau/:restaurantId/plan
// @access  Public
exports.getActivePlanForClient = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.restaurantId);

        if (!restaurant || restaurant.status !== 'valide') {
            return res.status(404).json({ msg: "Restaurant introuvable ou non validé." });
        }

        const activePlanId = restaurant.plan;
        if (!activePlanId) {
            return res.status(404).json({ msg: "Aucun plan de salle actif disponible." });
        }

        // 1. Récupérer les informations du Plan (URL de l'image)
        const plan = await Plan.findById(activePlanId).select('imageUrl name');

        // 2. Récupérer toutes les positions des tables pour ce plan, en peuplant les données de la Table physique
        const tablePositions = await TablePosition.find({ plan: activePlanId })
            .populate('table', 'tableNumber capacity isAvailable');

        // 3. Formater et filtrer les données pour le client
        const positionsClient = tablePositions
            .filter(pos => pos.table && pos.table.isAvailable) // S'assurer que la table est marquée comme disponible
            .map(pos => ({
                tableId: pos.table._id,
                tableNumber: pos.table.tableNumber,
                capacity: pos.table.capacity,
                x: pos.x,
                y: pos.y,
                rotation: pos.rotation,
                status: 'available' // Champ requis par le Frontend
            }));


        res.json({
            planImage: plan.imageUrl,
            planName: plan.name,
            positions: positionsClient
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur lors de la récupération du plan.');
    }
};


// @desc    Vérifier la disponibilité des tables pour un créneau donné
// @route   GET /api/restau/:restaurantId/disponibility?date=...&time=...&durationMinutes=...&guests=...
// @access  Public
exports.checkAvailability = async (req, res) => {

    const { date, time, durationMinutes, guests } = req.query;
    const { restaurantId } = req.params;

    if (!date || !time || !guests || !durationMinutes) {
        return res.status(400).json({ msg: 'Veuillez fournir la date, l\'heure, le nombre de personnes et la durée en minutes.' });
    }

    try {
        const numGuests = parseInt(guests);
        const actualDuration = parseInt(durationMinutes);

        // --- VALIDATION DE BASE ---
        if (isNaN(numGuests) || numGuests < 1 || isNaN(actualDuration) || actualDuration < 15 || actualDuration > 180) {
            return res.status(400).json({ msg: 'Le nombre de personnes ou la durée est invalide (durée min: 15, max: 180).' });
        }

        // 1. Définir le créneau (start et end)
        const dateTimeStr = `${date}T${time}:00.000Z`;
        const start = new Date(dateTimeStr);
        const end = new Date(start.getTime() + actualDuration * 60000);

        if (isNaN(start.getTime())) {
            return res.status(400).json({ msg: 'Format de date ou heure invalide.' });
        }

        // 2. Récupérer le Restaurant (pour les règles)
        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant || restaurant.status !== 'valide') {
            return res.status(404).json({ msg: "Restaurant introuvable ou non validé." });
        }

        const dayOfWeek = start.toLocaleString('fr-FR', { weekday: 'short' }).toUpperCase().replace('.', '');
        const requestedTime = start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false });

        // --- VÉRIFICATION 1 : OUVERTURE ---
        const openSlot = restaurant.openingHours.find(oh => oh.day === dayOfWeek);
        if (!openSlot || openSlot.isClosed || requestedTime < openSlot.opens || requestedTime > openSlot.closes) {
            return res.status(200).json({ msg: `Le restaurant est fermé ou n'est pas ouvert à cette heure.` });
        }

        // --- VÉRIFICATION 2 : CONTRÔLE DU DÉBIT (Max Covers) ---
        const serviceSlot = restaurant.serviceSlots.find(ss => ss.day === dayOfWeek && ss.time === requestedTime);

        if (!serviceSlot || serviceSlot.maxCovers === 0) {
            return res.status(200).json({ msg: "Aucun créneau de service disponible à cette heure." });
        }

        const existingReservationsAtSlot = await Reservation.find({
            restau: restaurantId,
            dateTime: { $gte: new Date(start.getTime() - 120000), $lt: new Date(start.getTime() + 120000) }, // +/- 2 min pour la granularité du créneau
            status: { $in: ['attente', 'confirme'] }
        });

        const bookedCovers = existingReservationsAtSlot.reduce((sum, res) => sum + res.numberOfGuests, 0);
        const remainingCovers = serviceSlot.maxCovers - bookedCovers;

        if (numGuests > remainingCovers) {
            return res.status(200).json({
                msg: `Désolé, seulement ${remainingCovers} couverts sont encore disponibles pour l'arrivée à ${requestedTime}.`,
                suggestion: "Veuillez essayer un créneau proche !"
            });
        }

        // --- VÉRIFICATION 3 : DISPONIBILITÉ PHYSIQUE DES TABLES (Chevauchement) ---

        // Trouver toutes les tables valides et disponibles avec une capacité suffisante
        const allCandidateTables = await Table.find({
            restau: restaurantId,
            capacity: { $gte: numGuests },
            isAvailable: true
        }).select('_id');

        const candidateTableIds = allCandidateTables.map(t => t._id);

        if (candidateTableIds.length === 0) {
            return res.status(200).json({ msg: 'Aucune table disponible pour cette capacité.' });
        }

        // Trouver les IDs des tables RÉSERVÉES qui chevauchent le créneau [start, end]
        // Utilisation de la logique d'intersection d'intervalles
        const reservedTables = await Reservation.find({
            restau: restaurantId,
            // ATTENTION : Le champ est 'allocatedTable' dans notre schéma ajusté, pas 'table'
            table: { $in: candidateTableIds },
            status: { $in: ['attente', 'confirme'] },
            $or: [
                // Condition 1: La réservation existante commence avant la fin du nouveau créneau
                { dateTime: { $lt: end } },
                // Condition 2: La réservation existante se termine après le début du nouveau créneau
                { $expr: { $gt: [{ $add: ['$dateTime', { $multiply: ['$durationMinutes', 60000] }] }, start] } }
            ]
        });

        const reservedTableIds = reservedTables.map(r => r.table.toString());

        // Filtrer pour obtenir les tables finalement disponibles
        const finalAvailableTables = allCandidateTables
            .filter(table => !reservedTableIds.includes(table._id.toString()));

        if (finalAvailableTables.length === 0) {
            return res.status(200).json({ msg: "Toutes les tables appropriées sont réservées pour ce créneau." });
        }

        // --- RÉSULTAT FINAL ---
        res.json({
            msg: "Créneau disponible ! Tables trouvées.",
            availableTableIds: finalAvailableTables.map(t => t._id),
            numAvailableTables: finalAvailableTables.length,
            // Retourner les tables disponibles avec leur capacité pour le client
            availableTables: finalAvailableTables
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur lors de la vérification de disponibilité.');
    }
};
// @desc    Récupérer les détails d'un restaurant spécifique
// @route   GET /api/restau/:id
// @access  Public
exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id)
            .select('-owner -status')
            .populate('plan', 'name imageUrl');

        if (!restaurant) {
            return res.status(404).json({ msg: "Restaurant non trouvé." });
        }

        res.json(restaurant);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: "ID invalide." });
        res.status(500).send('Erreur serveur.');
    }
};

// @desc    Lister les restaurants avec filtres (Ville, Cuisine, Nom)
// @route   GET /api/restau/search
// @access  Public
exports.searchRestaurants = async (req, res) => {
    try {
        const { city, cuisine, name } = req.query;
        let query = { status: 'valide' };

        // Filtre par ville (insensible à la casse)
        if (city) {
            query['adress.city'] = { $regex: city, $options: 'i' };
        }

        // Filtre par type de cuisine
        if (cuisine) {
            query.cuisine = { $regex: cuisine, $options: 'i' };
        }

        // Recherche par nom
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        const restaurants = await Restaurant.find(query).select('-owner -status -plan');
        res.json(restaurants);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur lors de la recherche.');
    }
};