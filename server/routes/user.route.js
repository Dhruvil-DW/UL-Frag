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
router.post('/sendinvite/:app_id', authMiddleware.checkAuth, userController.sendInviteApplication);
router.get('/getall/applications', authMiddleware.checkAuth, userController.getMyApplications);
router.get('/getall/pending/applications', authMiddleware.checkAuth, userController.getPendingApplications);
router.get('/getall/approve/applications', authMiddleware.checkAuth, userController.getApprovedApplications);
router.get('/viewapplication/:app_id', authMiddleware.checkAuth, userController.viewApplications);
router.get('/getinvitedapplication', authMiddleware.checkAuth, userController.getInvitedApplications);
module.exports = router;