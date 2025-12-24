const mongoose = require('mongoose');

<<<<<<< Updated upstream
=======
const openingHoursSchema = new mongoose.Schema({
    day: { type: String, enum: ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'] },
    opens: { type: String, default: '10:00' }, // Format HH:MM
    closes: { type: String, default: '22:00' }, // Format HH:MM
    isClosed: { type: Boolean, default: false }
}, { _id: false });

// Définition des créneaux de service pour chaque jour/heure
const serviceSlotSchema = new mongoose.Schema({
    day: { type: String, enum: ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'] },
    time: { type: String, required: true }, // Format HH:MM (ex: '19:00')
    maxCovers: { type: Number, required: true, default: 0 }, // Capacité maximale de clients pour ce créneau (couverts)
    // On pourrait aussi mettre 'maxReservations'
}, { _id: false });



const Table = require('./Table'); // Exemple
const Reservation = require('./Reservation');
const Plan = require('./Plan');



>>>>>>> Stashed changes
const restauSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nom: {
        type: String,
        required: true,
        trim: true
    },
    adresse: {
        type: String,
        required: true
    },
    cuisine: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
<<<<<<< Updated upstream
    tables: [
        {
            numero: Number,
            capacite: Number,
            isAvailable: {
                type: Boolean,
                default: true
            }
        }
    ],
=======
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        default: null
    },
    // NOUVEAU : Horaires d'ouverture
    openingHours: [openingHoursSchema],
    serviceSlots: [serviceSlotSchema],
    // NOUVEAU : Durée par défaut d'une réservation pour ce restaurant
    defaultReservationDuration: { type: Number, default: 90 }, // En minutes
>>>>>>> Stashed changes
    status: {
        type: String,
        enum: ['attente', 'valide'],
        default: 'attente'
<<<<<<< Updated upstream
    },
    createdAt: {
        type: Date,
        default: Date.now
=======
    }
},
    {
        timestamps: true
    });

restauSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        // Supprimer toutes les tables associées à ce restaurant
        await Table.deleteMany({ restau: this._id });
        // Supprimer toutes les réservations associées à ce restaurant
        await Reservation.deleteMany({ restau: this._id });
        // Supprimer Plan
        await Plan.deleteMany({ restau: this._id });

        next();
    } catch (error) {
        next(error); // Passer l'erreur
>>>>>>> Stashed changes
    }
});

module.exports = mongoose.model('Restau', restauSchema);
