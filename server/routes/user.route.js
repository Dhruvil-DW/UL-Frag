const express = require('express');
const userController = require('../controllers/user.controller'); 
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post("/add/profile", authMiddleware.checkAuth, userController.addProfileDetails);
router.get('/profile/details', authMiddleware.checkAuth, userController.getProfileDetails);
router.put('/profile/update', authMiddleware.checkAuth, userController.updateProfile);



module.exports = router;