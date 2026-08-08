const express = require('express');
const auditController = require('../controllers/AuditController');

const router = express.Router();

router.post('/', (req, res) => auditController.createAudit(req, res));
router.get('/:id', (req, res) => auditController.getAudit(req, res));

module.exports = router;
