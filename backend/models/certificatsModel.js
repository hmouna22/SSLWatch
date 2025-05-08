const pool = require('../db');
const tls = require('tls');

//connecter à la certificats et prendre des infos
function getSSLCertificate(domain, port = 443) {
    return new Promise((resolve, reject) => {
        const options = {
            host: domain,
            port: port,
            servername: domain,
            rejectUnauthorized: false
        };

        const socket = tls.connect(options, () => {
            const certificate = socket.getPeerCertificate(true);
            if (!certificate || Object.keys(certificate).length === 0) {
                reject(new Error('Aucun certificat reçu'));
                socket.end();
                return;
            }
            const result = {
                organisation: certificate.issuer.O,
                date_emission: certificate.valid_from,
                date_expiration: certificate.valid_to
            };
            socket.end();
            resolve(result);
        });

        socket.on('error', (err) => {
            reject(err);
        });
    });
}

// Obtenir tous les certificats
const getCertificats = async () => {
    const result = await pool.query(`
    SELECT 
      id_certificat, 
      nom_domaine, 
      organisation, 
      TO_CHAR(date_emission, 'YYYY-MM-DD') AS date_emission, 
      TO_CHAR(date_expiration, 'YYYY-MM-DD') AS date_expiration, 
      notification_envoyee,
      TO_CHAR(date_ajout, 'YYYY-MM-DD HH24:MI:SS') AS date_ajout
    FROM certificats 
    ORDER BY date_expiration ASC
  `);

    return result.rows;
};

// Obtenir les certificats à expirer dans 3 jours
const getToExpiredCertificats = async () => {
    const result = await pool.query(`
    SELECT
      id_certificat, 
      nom_domaine, 
      organisation, 
      TO_CHAR(date_emission, 'YYYY-MM-DD') AS date_emission, 
      TO_CHAR(date_expiration, 'YYYY-MM-DD') AS date_expiration, 
      notification_envoyee,
      TO_CHAR(date_ajout, 'YYYY-MM-DD HH24:MI:SS') AS date_ajout
    FROM certificats 
    WHERE date_expiration - CURRENT_DATE = 3;
  `);
    return result.rows;
};

// Ajouter un certificat
const addCertificat = async (nom_domaine) => {
    try {
        const certificat = await getSSLCertificate(nom_domaine);
        const result = await pool.query(
            `INSERT INTO certificats (nom_domaine, organisation, date_emission, date_expiration)
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [
                nom_domaine,
                certificat.organisation,
                certificat.date_emission,
                certificat.date_expiration
            ]
        );
        return result.rows[0];
    } catch (err) {
        console.error('Erreur lors de l’ajout du certificat :', err.message);
        throw err;
    }
};

// Supprimer un certificat par ID
const deleteCertificat = async (id_certificat) => {
    const result = await pool.query('DELETE FROM certificats WHERE id_certificat = $1', [id_certificat]);
    return result.rowCount;
};

// Mettre à jour la date d'émission et la date d'expiration d'un certificat et rendre la notification n'est pas envoyé pour les nouvelles dates
const updateCertificat = async (id_certificat, updatedData) => {
    const { date_emission, date_expiration } = updatedData;
    const result = await pool.query(
        `UPDATE certificats 
     SET date_emission = $1, date_expiration = $2, notification_envoyee = false
     WHERE id_certificat = $3 RETURNING *`,
        [date_emission, date_expiration, id_certificat]
    );
    return result.rows[0];
};

module.exports = {
    getSSLCertificate,
    getCertificats,
    getToExpiredCertificats,
    addCertificat,
    deleteCertificat,
    updateCertificat,
};