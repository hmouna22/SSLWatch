const Certificat = require('../models/certificatsModel');

// GET tous les certificats
const getAllCertificats = async (req, res) => {
    try {
        const certificats = await Certificat.getCertificats();
        res.status(200).json(certificats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Get certificates that expires on 3 days
const getToExpiredCertificats = async (req, res) => {
    try {
        const certificats = await Certificat.getToExpiredCertificats();
        res.status(200).json(certificats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST ajouter un certificat
const createCertificat = async (req, res) => {
    try {
        const { nom_domaine } = req.body;
        if (!nom_domaine) {
            return res.status(400).json({ error: "Le nom de domaine est requis." });
        }
        const nouveau = await Certificat.addCertificat(nom_domaine);
        res.status(201).json(nouveau);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// DELETE certificat
const deleteCertificat = async (req, res) => {
    try {
        const result = await Certificat.deleteCertificat(req.params.id);
        if (result > 0) {
            res.status(200).json({ message: 'Certificat supprimé.' });
        } else {
            res.status(404).json({ message: 'Certificat non trouvé.' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT mettre à jour un certificat
const updateCertificat = async (req, res) => {
    try {
        const updated = await Certificat.updateCertificat(req.params.id, req.body);
        if (updated) {
            res.status(200).json(updated);
        } else {
            res.status(404).json({ message: 'Certificat non trouvé.' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllCertificats,
    getToExpiredCertificats,
    createCertificat,
    deleteCertificat,
    updateCertificat,
};
