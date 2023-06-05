const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const applicationRoute = require('./application.route');

const router = express.Router();

//router.use('/auth', authRoute);     
router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/application', applicationRoute);

module.exports = router;