const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/usersModel');
require('dotenv').config();

const registerUser = async (req, res) => {
    try {
        const { nom_utilisateur, adresse_email, mot_de_passe, role_utilisateur } = req.body;

        const existingUser = await userModel.getUserByEmail(adresse_email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email déjà utilisé' });
        }

        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
        const newUser = await userModel.createUser(nom_utilisateur, adresse_email, hashedPassword, role_utilisateur);

        res.status(201).json({ message: 'Utilisateur créé avec succès', utilisateur: newUser });
    } catch (error) {
        console.error('Erreur création utilisateur:', error.message);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { adresse_email, mot_de_passe } = req.body;

        const user = await userModel.getUserByEmail(adresse_email);
        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const validPassword = await bcrypt.compare(mot_de_passe, user.mot_de_passe_hash);
        if (!validPassword) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign({ id: user.id_utilisateur, role: user.role_utilisateur }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        res.json({ message: 'Connexion réussie', token });
    } catch (error) {
        console.error('Erreur connexion utilisateur:', error.message);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Erreur récupération utilisateurs:', error.message);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers
};
