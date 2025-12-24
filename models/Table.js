const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    restau: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restau',
        required: true
    },
    tableNumber: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    // Position optionnelle si on ne veut pas passer par TablePosition (simplification)
    // ou si on veut lier directement
}, {
    timestamps: true
});

// Unicité du numéro de table par restaurant
tableSchema.index({ restau: 1, tableNumber: 1 }, { unique: true });

module.exports = mongoose.model('Table', tableSchema);
