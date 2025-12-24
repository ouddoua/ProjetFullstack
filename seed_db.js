const mongoose = require('mongoose');
const User = require('./models/User');
const Restau = require('./models/Restau');
const Plan = require('./models/Plan');
const Table = require('./models/Table');
const TablePosition = require('./models/TablePosition');
const bcrypt = require('bcryptjs');

// Configuration CORRIGÉE et VALIDÉE pour l'Université
const dbURI = "mongodb://aya_ouddou:52406785@193.48.125.44:27017/aya_ouddou?authSource=aya_ouddou&directConnection=true";

const seed = async () => {
    try {
        await mongoose.connect(dbURI, { serverSelectionTimeoutMS: 5000, family: 4 });
        console.log("MongoDB Connecté pour Seeding...");

        // 1. Nettoyage (Attention, ça efface tout !)
        await User.deleteMany({});
        await Restau.deleteMany({});
        await Plan.deleteMany({});
        await Table.deleteMany({});
        await TablePosition.deleteMany({});
        console.log("Base nettoyée.");

        // 2. Créer le Restaurateur
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("123456", salt);

        const owner = new User({
            name: "Mario Rossi",
            email: "mario@demo.com",
            password: hashedPassword,
            role: "restaurateur",
            phone: "0606060606"
        });
        await owner.save();
        console.log("Restaurateur créé : mario@demo.com / 123456");

        // 3. Créer le Plan
        const plan = new Plan({
            name: "Salle Principale",
            imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000&auto=format&fit=crop" // Image Blueprint
        });
        await plan.save();
        console.log("Plan créé.");

        // 4. Créer le Restaurant
        const restau = new Restau({
            owner: owner._id,
            name: "La Trattoria del Sol (Réel)",
            adress: {
                street: "1 Place du Capitole",
                city: "Toulouse",
                zipcode: "31000"
            },
            phone: "0561234567",
            cuisine: "Italienne",
            description: "Le meilleur de l'Italie en version connectée.",
            status: "valide", // Important pour être visible
            plan: plan._id,
            openingHours: [
                { day: "LUN", opens: "11:00", closes: "23:00" },
                { day: "MAR", opens: "11:00", closes: "23:00" },
                { day: "MER", opens: "11:00", closes: "23:00" },
                { day: "JEU", opens: "11:00", closes: "23:00" },
                { day: "VEN", opens: "11:00", closes: "23:00" },
                { day: "SAM", opens: "11:00", closes: "23:00" },
                { day: "DIM", opens: "11:00", closes: "23:00" }
            ],
            serviceSlots: [
                { day: "LUN", time: "19:00", maxCovers: 50 },
                { day: "MAR", time: "19:00", maxCovers: 50 },
                { day: "MER", time: "19:00", maxCovers: 50 },
                { day: "JEU", time: "19:00", maxCovers: 50 },
                { day: "VEN", time: "19:00", maxCovers: 50 },
                { day: "SAM", time: "19:00", maxCovers: 50 },
                { day: "DIM", time: "19:00", maxCovers: 50 }
            ]
        });
        await restau.save();
        console.log("Restaurant créé.");

        // 5. Créer les Tables et Positions
        const tablesConfig = [
            { num: 1, cap: 2, x: 100, y: 100, rot: 0 },
            { num: 2, cap: 4, x: 250, y: 200, rot: 15 },
            { num: 3, cap: 6, x: 400, y: 120, rot: 0 }
        ];

        for (const t of tablesConfig) {
            const table = new Table({
                restau: restau._id,
                tableNumber: t.num,
                capacity: t.cap,
                isAvailable: true
            });
            await table.save();

            const pos = new TablePosition({
                plan: plan._id,
                table: table._id,
                x: t.x,
                y: t.y,
                rotation: t.rot
            });
            await pos.save();
        }
        console.log("3 Tables créées et positionnées.");

        console.log("--- SEEDING TERMINÉ AVEC SUCCÈS ---");
        process.exit();

    } catch (err) {
        console.error("Erreur Seeding:", err);
        process.exit(1);
    }
};

seed();
