const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restau: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restau',
        required: true
    },
    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
        required: true
    },
    dateTime: { // REMPLACE 'date' ET 'heure' : Un seul champ Date/Heure complet
        type: Date,
        required: true
    },
    numberOfGuests: {
        type: Number,
        required: true,
        min: 1
    },
    nb_personnes: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['attente', 'confirme', 'annule'],
        default: 'attente'
    }
},
    {
        timestamps: true // Utilisation de l'option timestamps
    });

// Index important pour la performance des requêtes de disponibilité :
// Chercher les réservations pour un restaurant à un moment donné.
reservationSchema.index({ restau: 1, dateTime: 1, table: 1 });
module.exports = mongoose.model('Reservation', reservationSchema);
