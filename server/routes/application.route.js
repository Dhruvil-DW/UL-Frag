const express = require('express');
const uploadMiddleware = require('../middlewares/upload.middleware');
const applicationController = require('../controllers/application.controller'); 
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/questions/getall', authMiddleware.checkAuth, applicationController.getAllQuestions);
router.get('/getregions', authMiddleware.checkAuth, applicationController.getRegionNames);
router.get('/getcountry/:region_id', authMiddleware.checkAuth, applicationController.getCountryNames);
router.get('/getdraft/:app_id', authMiddleware.checkAuth, applicationController.getDraftedApp);
//router.get('/get/nestedquestion/:parent_id', authMiddleware.checkAuth, applicationController.getNestedQuestion);

// router.post('/submit', authMiddleware.checkAuth, applicationController.submitApplication)
router.post('/submit', uploadMiddleware.array('filename', 30), authMiddleware.checkAuth, applicationController.submitApplication);
router.post('/draft', uploadMiddleware.array('filename', 30), authMiddleware.checkAuth, applicationController.draftApplication);
router.get("/getimg/:image_name", applicationController.getImage);


module.exports = router;