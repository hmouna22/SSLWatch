
-- Création de la table des utilisateurs avec rôle
CREATE TABLE utilisateurs (
    id_utilisateur SERIAL PRIMARY KEY, -- identifiant unique de l’utilisateur
    nom_utilisateur VARCHAR(100) NOT NULL UNIQUE, -- nom d'utilisateur
    adresse_email VARCHAR(150) NOT NULL UNIQUE, -- adresse e-mail
    mot_de_passe_hash TEXT NOT NULL, -- mot de passe (haché)
    role_utilisateur VARCHAR(20) NOT NULL DEFAULT 'utilisateur', -- rôle (utilisateur ou admin)
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- date de création du compte
);

-- Création de la table des certificats
CREATE TABLE certificats (
    id_certificat SERIAL PRIMARY KEY, -- identifiant unique du certificat
    nom_domaine VARCHAR(255) NOT NULL, -- nom de domaine
    organisation VARCHAR(255), -- organisation émettrice
    date_emission DATE NOT NULL, -- date d’émission du certificat
    date_expiration DATE NOT NULL, -- date d’expiration
    notification_envoyee BOOLEAN DEFAULT FALSE, -- notification déjà envoyée ?
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- date d’enregistrement
);
