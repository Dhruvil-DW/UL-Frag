require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('../models/index');

function checkAuth(req,res,next) {
    try{
        let token;
    if (req.headers.authorization != undefined) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Check in case of forgot password page
    if (req.query.token) {
      token = req.query.token;
    }
    console.log(token);

    const decodetoken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    req.userdata = decodetoken;
    req.token = token;
    next();
    } catch(e){
        return res.status(401).json({
            message: "Invalid or Expired Token"
        });
    }
}

module.exports = {
    checkAuth
}