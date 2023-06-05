const express = require('express');
const userController = require('../controllers/user.controller'); 
const authMiddleware = require('../middlewares/auth.middleware');
const applicationController = require('../controllers/application.controller');
const router = express.Router();

router.post("/profile/add", authMiddleware.checkAuth, userController.addProfileDetails);
router.get('/profile/get', authMiddleware.checkAuth, userController.getProfileDetails);
router.put('/profile/update', authMiddleware.checkAuth, userController.updateProfile);

router.post('/submit', authMiddleware.checkAuth, applicationController.submitApplication)
router.post('/draft', authMiddleware.checkAuth, applicationController.draftApplication);

module.exports = router;