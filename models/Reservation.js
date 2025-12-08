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
    date: {
        type: Date,
        required: true
    },
    heure: {
        type: String, // Format "HH:mm"
        required: true
    },
    nb_personnes: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['attente', 'confirme', 'annule'],
        default: 'attente'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reservation', reservationSchema);
