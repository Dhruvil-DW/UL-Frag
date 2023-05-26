const express = require('express');
const userController = require('../controllers/user.controller'); 
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post("/profile/add", authMiddleware.checkAuth, userController.addProfileDetails);
router.get('/profile/get', authMiddleware.checkAuth, userController.getProfileDetails);
router.put('/profile/update', authMiddleware.checkAuth, userController.updateProfile);



module.exports = router;