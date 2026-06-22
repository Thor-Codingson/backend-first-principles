// routes/health.routes.js
const express = require('express');
const router = express.Router();
const healthService = require('../services/health.service')

router.get('/live', (req, res) => res.status(200).json({ status: 'ok' }));

router.get('/ready', async (req, res) => {
   try {
    await healthService.checkIfDbReady();
    res.status(200).json({ status: 'ready' });
  } catch (err) {
    res.status(503).json({
      status: 'not ready',
      reason: err.message
    });
  }
});

module.exports = router