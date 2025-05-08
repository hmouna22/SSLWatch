const cron = require('node-cron');
const pool = require('./db');
const certificatsModel = require('./models/certificatsModel')
const { envoyerEmail } = require('./email');

// Liste des destinataires
const destinataires = [
  'mounahamdi72@gmail.com',
  'boukhchim.ameur@gmail.com',
  'mehersakhri8@gmail.com'
];

//tester email manuellement
//envoyerEmail('mounahamdi72@gmail.com', 'Test Cron', 'Ceci est un test d’email');

//surveille to send notification
cron.schedule('* * * * *', () => {
  console.log('Vérification des certificats expirant dans 3 semaines...');

  try {
    pool.query(
      "SELECT * FROM certificats WHERE date_expiration - CURRENT_DATE = 20 AND notification_envoyee = false;",
      function (err, result) {
        if (err) {
          console.error('Erreur lors de la récupération des certificats:', err);
          return;
        }

        console.log('Cettificats à expiré bientôt:', result.rows);
        result.rows.forEach(certificat => {
          let date_expiration = new Date(certificat.date_expiration).toLocaleDateString('sv-SE');
          let sujet = `⚠️ Le certificat pour ${certificat.nom_domaine} expire bientôt`;
          let message = `Bonjour,\n\nLe certificat SSL du domaine ${certificat.nom_domaine} expire le ${date_expiration}. Merci de procéder à son renouvellement.\n\nCordialement,\nVotre système de surveillance`;
          console.log("message:", certificat.nom_domaine, certificat.date_expiration);
          // destinataires.forEach(email => {
          // envoyerEmail(email, sujet, message);
          //});
          envoyerEmail("mouna.hamdi@rns.tn", sujet, message);
          pool.query(
            "UPDATE certificats SET notification_envoyee = true WHERE id_certificat = $1",
            [certificat.id_certificat]
          );
        });
      }
    );
  } catch (error) {
    console.error('Erreur non capturée:', error);
  }
});


//surveille to change dates 
cron.schedule('* * * * *', () => {
  console.log('Vérification mise à jour certificats...');

  try {
    pool.query(
      "SELECT id_certificat, nom_domaine FROM certificats WHERE notification_envoyee = true;",
      function (err, result) {
        if (err) {
          console.error('Erreur lors de la récupération des certificats:', err);
          return;
        }

        console.log('Certificats a changé:', result.rows);
        result.rows.forEach(certificat => {
          const cert = certificatsModel.getSSLCertificate(certificat.nom_domaine);
          if (cert.date_emission != certificat.date_emission && cert.date_expiration != certificat.date_expiration) {
            const new_dates = { date_emission: cert.date_emission, date_expiration: cert.date_expiration }
            certificatsModel.updateCertificat(certificat.id_certificat, new_dates);
          }
        }
        )
      }
    );
  } catch (error) {
    console.error('Erreur non capturée:', error);
  }
});