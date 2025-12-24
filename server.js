
const app = require("./app");
require('dotenv').config();
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

<<<<<<< Updated upstream
// Connect to Database then start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
=======
const startServer = async () => {
    try {
        // 1. Connexion MongoDB (ON ATTEND)
        await connectDB();

        // 2. Création du serveur HTTP
        const server = http.createServer(app);

        // 3. Initialisation Socket.io
        const io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST", "PUT", "DELETE"]
            }
        });

        // 4. Partage de io avec Express
        app.set('socketio', io);

        // 5. Gestion Socket
        io.on('connection', (socket) => {
            console.log(`🟢 Nouvelle connexion : ${socket.id}`);

            socket.on('join_restaurant', (restaurantId) => {
                socket.join(restaurantId);
                console.log(`➡️ Rejoint la salle : ${restaurantId}`);
            });

            socket.on('disconnect', () => {
                console.log('🔴 Utilisateur déconnecté');
            });
        });

        // 6. Lancement du serveur (SEULEMENT ICI)
        server.listen(PORT, () => {
            console.log(`🚀 Serveur lancé sur le port ${PORT}`);
        });

    } catch (err) {
        console.error("❌ Échec du démarrage du serveur :", err.message);
        process.exit(1);
    }
};

startServer();
>>>>>>> Stashed changes
