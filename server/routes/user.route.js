const express = require('express');
const userController = require('../controllers/user.controller'); 
const authMiddleware = require('../middlewares/auth.middleware');
const applicationController = require('../controllers/application.controller');
// const answerController = require('../controllers/answer.controller');
const router = express.Router();

router.post("/profile/add", authMiddleware.checkAuth, userController.addProfileDetails);
router.get('/profile/get', authMiddleware.checkAuth, userController.getProfileDetails);
router.put('/profile/update', authMiddleware.checkAuth, userController.updateProfile);

router.post('/submit', authMiddleware.checkAuth, applicationController.submitApplication)
router.post('/draft', authMiddleware.checkAuth, applicationController.draftApplication);
//router.post('/sendinvite/:app_id', authMiddleware.checkAuth, applicationController.sendInviteApplication);
//router.get('/getanswers', authMiddleware.checkAuth, answerController.getAnswers);
router.get('/getall/applications', authMiddleware.checkAuth, userController.getAllApplications);
router.get('/getall/approve/applications', authMiddleware.checkAuth, userController.getApprovedApplications);
router.get('/viewapplication/:app_id', authMiddleware.checkAuth, userController.viewApplications);
module.exports = router;