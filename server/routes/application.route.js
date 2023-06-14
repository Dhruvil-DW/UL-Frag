const express = require('express');
const applicationController = require('../controllers/application.controller'); 
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/questions/getall', authMiddleware.checkAuth, applicationController.getAllQuestions);
router.get('/getregions', authMiddleware.checkAuth, applicationController.getRegionNames);
router.get('/getcountry/:region_id', authMiddleware.checkAuth, applicationController.getCountryNames);
router.get('/getdraft/:app_id', authMiddleware.checkAuth, applicationController.getDraftedApp);
router.post('/submit', authMiddleware.checkAuth, applicationController.submitApplication)
router.post('/draft', authMiddleware.checkAuth, applicationController.draftApplication);
router.get('/copy/:app_id', authMiddleware.checkAuth, applicationController.copyApplication);
module.exports = router;