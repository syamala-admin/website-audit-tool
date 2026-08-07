'use strict';

const express = require('express');
const { createAudit } = require('../controllers/auditController');

const router = express.Router();

router.post('/audit', createAudit);

module.exports = router;
