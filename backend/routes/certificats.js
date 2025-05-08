const express = require('express');
const router = express.Router();
const certificatCtrl = require('../controllers/certificatsController');

// Routes
router.get('/', certificatCtrl.getAllCertificats);
router.get('/toexpired', certificatCtrl.getToExpiredCertificats);
router.post('/', certificatCtrl.createCertificat);
router.delete('/:id', certificatCtrl.deleteCertificat);
router.put('/:id', certificatCtrl.updateCertificat);

module.exports = router;
