const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // CONFIGURATION GAGNANTE (Celle qui a affiché "SUCCÈS" dans test-db.js)
        const dbURI = "mongodb://aya_ouddou:52406785@193.48.125.44:27017/aya_ouddou?authSource=aya_ouddou&directConnection=true";

        console.log("Tentative de connexion Mongoose (Mode Force IPv4)...");

        const conn = await mongoose.connect(dbURI, {
            serverSelectionTimeoutMS: 5000,
            family: 4 // Force IPv4 : CRUCIAL pour le réseau de l'université
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        // Ne pas quitter le processus, réessayer
        console.log("Nouvelle tentative dans 5 secondes...");
        setTimeout(connectDB, 5000);
    }
};

module.exports = connectDB;
