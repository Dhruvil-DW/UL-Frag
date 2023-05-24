const db = require('../models/index');
const User = db.User;
const generateToken = require('../config/jwt.config');
const seq = require('../config/sequelize.config');

function login(req,res){
    const email = req.body.email;
    const otp = 00000;
    (async () => {
        const data = await seq.seqFindOne(User, ['id','role_id', 'unique_id',
        'email', 'first_name', 'last_name'],{ email:email, otp:otp });
        if(data && data != 500){
            console.log("Data", data);
            res.status(200).send("OTP sent for verification")
            return;
        }
            const newUserId = (await seq.seqCount(User)) + 1;
            const user = {
                unique_id: "frag_usr_" + newUserId,
                // first_name : req.body.first_name,
                // last_name: req.body.last_name,
                email: email,
                role_id:0,
                //contact_no:req.body.contact_no,
                otp: otp,
                //token:token
            }
            console.log("user-", user);
            const createRes= await seq.seqCreate(User, user);
            if(createRes == 500){
                res.status(500).send({message: "Some error occured while creating the user"});
            }
            res.status(200).send({message: "OTP sent for verification"})
        //const token = await generateToken(data);
    })();
}

function verifyOtp(req, res){
    const email = req.body.email;
    const otp = req.body.otp;
    //console.log(req.body.otp);
    (async ()=> {
        const data = await seq.seqFindOne(User, ['email', 'otp', 'role_id'],{email:email});
        console.log("data", data.otp);
        //const otp = req.body.otp;
        if(data.otp == otp){
            console.log("inside");
            const token = await generateToken(data);
            console.log("token", token);
            res.status(200).send({ message: "OTP Verified", token: token}) 
        } else {
            res.status(400).send({ message: "OTP didn't match" });
        }
    })();
}

function resendOtp(req, res) {
    const email = req.body.email;
    //const newOtp = 0;
  
    (async () => {
      const getRes = await seq.seqFindOne(User, ['email', 'otp', 'role_id'],{ email: email });
      if(getRes == 500){
        res.status(500).send({ message: "Some error occurred while resent otp." });
      }
      res.status(200).send({ message: "New OTP sent" })
    })();
  }

module.exports = {
    login, verifyOtp, resendOtp
}