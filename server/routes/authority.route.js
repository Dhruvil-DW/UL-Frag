const express = require('express');
const authorityController = require('../controllers/authority.controller'); 
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

router.put('/approve/application/:app_id/:type', authMiddleware.checkAuth, authorityController.approveRejectApplication);
module.exports = router;