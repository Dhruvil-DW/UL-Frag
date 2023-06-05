const express = require('express');
const authController = require('../controllers/auth.controller'); 

const router = express.Router();

router.post("/sendotp", authController.sendOTP);
router.post("/verifyotp", authController.verifyOtp);
router.get("/resendotp", authController.resendOtp);

module.exports = router;