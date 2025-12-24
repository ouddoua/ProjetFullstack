const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String, // URL de l'image de fond (blueprint)
        required: true
    },
    restau: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restau'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Plan', planSchema);
