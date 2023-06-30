const db = require('../models/index');
const User = db.User;
const generateToken = require('../config/jwt.config');
const seq = require('../config/sequelize.config');
const sendEmail = require('../config/mail.config');

function sendOTP(req, res) {
    const email = req.body.email;
    const otp = Math.floor(1000 + Math.random() * 9000);

    (async () => {
        const data = await seq.seqFindOne(User, ['id', 'first_name','last_name'], { email: email });
        if (data === 500) {
            res.status(500).send({ message: "Error while getting EmailID" });
            return;
        }
        if (data) {
            const updateOtpRes = await seq.seqUpdate(User, { otp: otp }, { id: data.id });
            if (updateOtpRes === 500) return res.status(500).send({ message: "Error while updating OTP" });
        } else {
            const newUser = { email: email, otp: otp, role_id: 0 }
            const addUserRes = await seq.seqCreate(User, newUser);
            if (addUserRes === 500) return res.status(500).send({ message: "Error while creating User" });
        }
        sendEmail([email], `OTP for Your Fragrance Login`,
            `Your One Time Password (OTP) is <b>${otp}</b>.`)
        res.status(200).send({ message: "OTP sent successfully" });
    })();
}

function verifyOtp(req, res) {
    const email = req.body.email;
    const otp = req.body.otp;
    console.log(req.body);
    (async () => {
        const data = await seq.seqFindOne(User, ['id', 'unique_id', 'role_id', 'email', 'otp', 'first_name', 'last_name'], { email: email });
        if (!Boolean(data)) {
            res.status(500).send({ message: "No User Found" });
            return;
        }
        console.log("data", data.otp);
        if (data.otp == otp) {
            console.log("inside");
            const token = await generateToken(data);
            console.log("token", token);
            res.status(200).send({ message: "OTP Verified", token: token })
        } else {
            res.status(400).send({ message: "OTP didn't match" });
        }
    })();
}

function resendOtp(req, res) {
    const email = req.body.email;
    //const newOtp = 0;
    const otp = Math.floor(1000 + Math.random() * 9000);

    (async () => {
        const getRes = await seq.seqFindOne(User, ['email', 'otp', 'role_id'], { email: email });
        if (getRes === 500) {
            res.status(500).send({ message: "Some error occurred while resent otp." });
        }
        res.status(200).send({ message: "New OTP sent" });
    })();
}

module.exports = {
    sendOTP, verifyOtp, resendOtp
}