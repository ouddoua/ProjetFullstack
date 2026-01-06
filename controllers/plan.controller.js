const Plan = require('../models/Plan');
const Table = require('../models/Table');
const TablePosition = require('../models/TablePosition');
const Restau = require('../models/Restau');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'uploads/plans/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, 'plan-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Images only!'));
    }
}).single('image');

exports.uploadPlanImage = (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            return res.status(400).json({ msg: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }
        // Return relative path. Assuming server serves 'uploads' at root or similar.
        // We set up app.use('/uploads', ...) so path is /uploads/plans/filename
        const imageUrl = `/uploads/plans/${req.file.filename}`;
        res.json({ imageUrl });
    });
};

exports.savePlan = async (req, res) => {
    const { name, imageUrl, tables } = req.body; // tables: [{ tableNumber, capacity, x, y, rotation, shape, ... }]

    try {
        const restau = await Restau.findOne({ owner: req.user.id });
        if (!restau) {
            return res.status(404).json({ msg: 'Restaurant non trouvé' });
        }

        // 1. Find or Create Plan
        let plan = await Plan.findOne({ restau: restau._id });
        if (plan) {
            plan.name = name || plan.name;
            plan.imageUrl = imageUrl || plan.imageUrl;
            await plan.save();
        } else {
            plan = new Plan({
                name: name || 'Plan Principal',
                imageUrl,
                restau: restau._id
            });
            await plan.save();

            // Update Restau to link to this plan
            restau.plan = plan._id;
            await restau.save();
        }

        // 2. Process Tables
        console.log(`Processing ${tables.length} tables for plan ${plan._id}`);
        // Strategy: We want to preserve existing tables if possible to keep reservations linked?
        // But if user removes a table from UI, it should be removed? 
        // For now, let's just Sync.
        // Get existing tables
        const existingTables = await Table.find({ restau: restau._id });
        const existingTableMap = new Map(existingTables.map(t => [t.tableNumber, t]));

        const processedTableIds = [];

        for (const tData of tables) {
            let table = existingTableMap.get(tData.tableNumber);

            if (table) {
                // Update
                table.capacity = tData.capacity;
                table.isAvailable = tData.isAvailable !== undefined ? tData.isAvailable : table.isAvailable;
                await table.save();
            } else {
                // Create
                table = new Table({
                    restau: restau._id,
                    tableNumber: tData.tableNumber,
                    capacity: tData.capacity,
                    isAvailable: tData.isAvailable !== undefined ? tData.isAvailable : true
                });
                await table.save();
            }

            processedTableIds.push(table._id);

            // Update/Create Position
            const positionPayload = {
                plan: plan._id,
                table: table._id,
                x: tData.x,
                y: tData.y,
                rotation: tData.rotation || 0,
            };

            const savedPos = await TablePosition.findOneAndUpdate(
                { plan: plan._id, table: table._id },
                positionPayload,
                { upsert: true, new: true }
            );
            console.log(`Saved position for table ${table.tableNumber}:`, savedPos._id);
        }

        // Optional: Remove tables not in the new list?
        await TablePosition.deleteMany({
            plan: plan._id,
            table: { $nin: processedTableIds }
        });

        console.log("Plan saved successfully");
        res.json({ msg: 'Plan sauvegardé avec succès', planId: plan._id });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

exports.getPlan = async (req, res) => {
    try {
        let restauId;
        // If user is owner, get their own restau
        if (req.user && req.user.role === 'restaurateur') {
            const restau = await Restau.findOne({ owner: req.user.id });
            if (restau) restauId = restau._id;
        } else if (req.params.restauId) {
            restauId = req.params.restauId;
        }

        if (!restauId) {
            return res.status(404).json({ msg: 'Restaurant non trouvé' });
        }

        const plan = await Plan.findOne({ restau: restauId });
        if (!plan) {
            return res.json({ msg: 'Aucun plan trouvé', plan: null });
        }

        const positions = await TablePosition.find({ plan: plan._id }).populate('table');

        // Format response
        const tables = positions.map(pos => ({
            ...pos.table.toObject(),
            x: pos.x,
            y: pos.y,
            rotation: pos.rotation
        }));

        res.json({
            plan,
            tables
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};
