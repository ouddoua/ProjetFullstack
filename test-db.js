const mongoose = require('mongoose');

// L'URI que nous testons
const uri = "mongodb://aya_ouddou:52406785@193.48.125.44:27017/aya_ouddou?authSource=aya_ouddou&directConnection=true";

console.log("Tentative de connexion à :", uri.replace(/:([^:@]+)@/, ":****@")); // Cache le mot de passe dans les logs

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000, // Timeout court pour voir l'erreur vite
    socketTimeoutMS: 45000,
    family: 4 // Force IPv4
})
    .then(() => {
        console.log("✅ SUCCÈS : Connexion Mongoose réussie !");
        // Testons une requête simple pour être sûr
        const connection = mongoose.connection;
        connection.db.listCollections().toArray((err, names) => {
            if (err) {
                console.error("❌ ERREUR : Impossible de lister les collections :", err);
            } else {
                console.log("📂 Collections trouvées :", names.map(c => c.name));
            }
            mongoose.disconnect();
        });
    })
    .catch(err => {
        console.error("❌ ÉCHEC TOTAL :");
        console.error("Nom de l'erreur :", err.name);
        console.error("Message :", err.message);
        if (err.reason) console.error("Raison :", err.reason);
        process.exit(1);
    });
