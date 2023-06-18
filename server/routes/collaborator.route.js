const express = require('express');
const appInviteController = require('../controllers/application.invite.controller')
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/invite/:app_id', authMiddleware.checkAuth, appInviteController.sendInviteApplication);
router.get('/get/:app_id', authMiddleware.checkAuth, appInviteController.getApplicationInvite);

module.exports = router;
