const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Récupérer le token du header
    const token = req.header('x-auth-token');

    // Vérifier si pas de token
    if (!token) {
        return res.status(401).json({ msg: 'Pas de token, autorisation refusée' });
    }

    try {
        const decoded = jwt.verify(token, 'votre_secret_jwt'); // Mettre la même clé secrète que dans auth.controller
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token non valide' });
    }
};
