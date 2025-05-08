const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleWare');

// Ajout
router.post('/register', userController.registerUser);

// Connexion
router.post('/login', userController.loginUser);

// Liste des utilisateurs (optionnel, selon les droits)
router.get('/', userController.getAllUsers);


// Route protégée (accessible à tout utilisateur connecté)
//router.get('/', authenticateToken, userController.getAllUsers);

module.exports = router;