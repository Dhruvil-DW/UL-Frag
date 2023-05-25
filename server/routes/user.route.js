const express = require('express');
const userController = require('../controllers/user.controller'); 
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post("/add/profile", authMiddleware.checkAuth, userController.addProfileDetails);
router.get('/profile/details', authMiddleware.checkAuth, userController.getProfileDetails);

module.exports = router;