const express = require('express');
const userController = require('../controllers/user.controller'); 
const authMiddleware = require('../middlewares/auth.middleware');
// const answerController = require('../controllers/answer.controller');
const router = express.Router();

router.post("/profile/add", authMiddleware.checkAuth, userController.addProfileDetails);
router.get('/profile/get', authMiddleware.checkAuth, userController.getProfileDetails);
router.put('/profile/update', authMiddleware.checkAuth, userController.updateProfile);

//router.post('/sendinvite/:app_id', authMiddleware.checkAuth, applicationController.sendInviteApplication);
//router.get('/getanswers', authMiddleware.checkAuth, answerController.getAnswers);

router.get('/get/myapplications', authMiddleware.checkAuth, userController.getMyApplications);
router.get('/get/approvedapplications', authMiddleware.checkAuth, userController.getApprovedApplications);
router.get('/get/invitedapplications', authMiddleware.checkAuth, userController.getInvitedApplications);
router.get('/get/export/:app_id', authMiddleware.checkAuth, userController.getExportPDF);
router.get('/viewapplication/:app_id', authMiddleware.checkAuth, userController.viewApplications);
module.exports = router;