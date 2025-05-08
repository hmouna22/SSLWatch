const pool = require('../db');

// Créer un nouvel utilisateur
const createUser = async (nom_utilisateur, adresse_email, mot_de_passe_hash, role_utilisateur = 'utilisateur') => {
    const result = await pool.query(
        `INSERT INTO utilisateurs (nom_utilisateur, adresse_email, mot_de_passe_hash, role_utilisateur)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [nom_utilisateur, adresse_email, mot_de_passe_hash, role_utilisateur]
    );
    return result.rows[0];
};

// Récupérer un utilisateur par email
const getUserByEmail = async (adresse_email) => {
    const result = await pool.query(
        `SELECT * FROM utilisateurs WHERE adresse_email = $1`,
        [adresse_email]
    );
    return result.rows[0];
};

// Récupérer un utilisateur par ID
const getUserById = async (id_utilisateur) => {
    const result = await pool.query(
        `SELECT * FROM utilisateurs WHERE id_utilisateur = $1`,
        [id_utilisateur]
    );
    return result.rows[0];
};

// Obtenir tous les utilisateurs (optionnel si tu en as besoin)
const getAllUsers = async () => {
    const result = await pool.query(
        `SELECT id_utilisateur, nom_utilisateur, adresse_email, role_utilisateur, TO_CHAR(date_creation, 'YYYY-MM-DD HH24:MI:SS') AS date_creation
         FROM utilisateurs
         ORDER BY id_utilisateur ASC`
    );
    return result.rows;
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    getAllUsers
};
