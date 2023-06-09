const express = require('express');
const applicationController = require('../controllers/application.controller'); 
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/questions/getall', authMiddleware.checkAuth, applicationController.getAllQuestions);
router.get('/getcountry', authMiddleware.checkAuth, applicationController.getCountryNames);
//router.get('/get/nestedquestion/:parent_id', authMiddleware.checkAuth, applicationController.getNestedQuestion);


module.exports = router;