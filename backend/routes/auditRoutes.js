const express = require('express');
const router  = express.Router();
const { getAuditLogs, getFilterOptions, getAuditById } = require('../controllers/auditController');


router.get('/filters', getFilterOptions);
router.get('/:id',     getAuditById);
router.get('/',        getAuditLogs);

module.exports = router;