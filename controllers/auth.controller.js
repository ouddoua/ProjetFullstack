const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Inscrire un utilisateur (Client ou Restaurateur)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    const { nom, email, password, role, telephone } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Un utilisateur avec cet email existe déjà' });
        }

        // Créer un nouvel utilisateur
        user = new User({
            nom,
            email,
            password,
            role,
            telephone
        });

        // Le mot de passe sera hashé par le middleware pre-save du modèle
        await user.save();

        // Créer le payload pour le JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        // Signer le token
        jwt.sign(
            payload,
            'votre_secret_jwt', // TODO: Utiliser process.env.JWT_SECRET dans un vrai projet
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token });
            }
        );
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
