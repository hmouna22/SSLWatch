const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ma_clé_secrète';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

    if (!token) return res.status(401).json({ message: 'Token manquant' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token invalide' });

        req.user = user; // { id: ..., role: ... }
        next();
    });
}

// Middleware spécifique aux admins
function authorizeAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
    }
    next();
}

module.exports = {
    authenticateToken,
    authorizeAdmin
};
