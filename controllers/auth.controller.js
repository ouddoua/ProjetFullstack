const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Inscrire un utilisateur (Client ou Restaurateur)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => { // <--- AJOUT DE next ICI
    const { nom, email, password, role, telephone } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'Un utilisateur avec cet email existe déjà' });

        user = new User({ nom, email, password, role, telephone });
        await user.save();

        const payload = { user: { id: user.id, role: user.role } };

        jwt.sign(payload, 'votre_secret_jwt', { expiresIn: '5d' }, (err, token) => {
            if (err) return res.status(500).json({ msg: "Erreur JWT" }); // <--- PAS de throw err
            res.status(201).json({ token });
        });
    } catch (err) {
        console.error("ERREUR REGISTER:", err.message);
        res.status(500).json({ msg: "Erreur technique: " + err.message });
    }
};

// @desc    Authentifier un utilisateur & récupérer le token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Identifiants invalides' });
        }

        // Vérifier le mot de passe
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Identifiants invalides' });
        }

        // Payload JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        // Signer le token
        jwt.sign(
            payload,
            'votre_secret_jwt',
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error("ERREUR REGISTER:", err.message);
        res.status(500).json({ msg: "Erreur technique: " + err.message });
    }
};

// @desc    Récupérer les infos du profil utilisateur connecté
// @route   GET /api/auth/profil
// @access  Privé
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error("ERREUR REGISTER:", err.message);
        res.status(500).json({ msg: "Erreur technique: " + err.message });
    }
};

// @desc    Déconnexion (Côté serveur, c'est surtout le client qui supprime le token)
// @route   GET /api/auth/logout
// @access  Public
exports.logout = (req, res) => {
    // Note: Avec JWT sans cookies httpOnly, la déconnexion se gère principalement côté client en supprimant le token du stockage.
    // Ici on peut juste renvoyer un succès.
    res.json({ msg: 'Déconnexion réussie' });
};

/*Amelioration possible:
// @desc    Authentifier un utilisateur
exports.login = async (req, res, next) => { // <--- AJOUT DE next ICI
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Identifiants invalides' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ msg: 'Identifiants invalides' });

        const payload = { user: { id: user.id, role: user.role } };

        jwt.sign(payload, 'votre_secret_jwt', { expiresIn: '5d' }, (err, token) => {
            if (err) return res.status(500).json({ msg: "Erreur JWT" }); // <--- PAS de throw err
            res.json({ token });
        });
    } catch (err) {
        console.error("ERREUR LOGIN:", err.message);
        res.status(500).json({ msg: "Erreur technique: " + err.message });
    }
};

// @desc    Récupérer les infos du profil
exports.getProfile = async (req, res, next) => { // <--- AJOUT DE next ICI
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error("ERREUR PROFILE:", err.message);
        res.status(500).json({ msg: "Erreur technique: " + err.message });
    }
};*/