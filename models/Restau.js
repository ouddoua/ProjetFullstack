const mongoose = require('mongoose');

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
    status: {
        type: String,
        enum: ['attente', 'valide'],
        default: 'attente'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Restau', restauSchema);
