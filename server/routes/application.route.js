const express = require('express');
const applicationController = require('../controllers/application.controller'); 
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/questions/getall', authMiddleware.checkAuth, applicationController.getAllQuestions);
router.get('/getcountry', authMiddleware.checkAuth, applicationController.getCountryNames);
router.get('/getdraft/:app_id', authMiddleware.checkAuth, applicationController.getDraftedApp);
//router.get('/get/nestedquestion/:parent_id', authMiddleware.checkAuth, applicationController.getNestedQuestion);

router.post('/submit', authMiddleware.checkAuth, applicationController.submitApplication)
router.post('/draft', authMiddleware.checkAuth, applicationController.draftApplication);

module.exports = router;