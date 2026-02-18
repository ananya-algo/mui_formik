const express = require('express');
const router  = express.Router();
const { getSummary, getKpis, getViolations } = require('../controllers/dashboardController');

router.get('/summary',    getSummary);
router.get('/kpis',       getKpis);
router.get('/violations', getViolations);

module.exports = router;