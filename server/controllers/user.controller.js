const db = require('../models/index');
const User = db.User;
const generateToken = require('../config/jwt.config');
const seq = require('../config/sequelize.config');

function addProfileDetails(req, res){
    //console(req.body);
    const userId = req.userdata.user_id;
    (async () => {
        const tokenData = {
            user_id: userId,
            unique_id: "frag_usr_" + userId,
            role_id: 1,
            email: req.userdata.email  
        };
        const token = await generateToken(tokenData);
        const userData = {
            unique_id : "frag_usr_" + userId,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            contact_no: req.body.contact_no,
            role_id: 1,   
            token: token
        };
        
        console.log("USER ID: ", userId);
        console.log("USER DATA: ", userData);
        console.log("USER BODY: ", req.body);
        const data = await seq.seqUpdate(User, userData, { id: userId });
        //console.log(data.token);
        console.log(data);
        if (data === 500) {
            res.status(500).send({ message: "Error while adding user details" });
            return;
        }
        res.status(200).send({ message: "User successfully added" , token:token});
})();
}

function getProfileDetails(req,res){
    (async () => {
        const userRes = await seq.seqFindByPk(User, req.userdata.user_id, ['id', 'unique_id', 'first_name','last_name','email', 'contact_no', 'role_id']);
        if (userRes === 500){
            res.status(500).send({message: "Error while getting profile details"});
            return;
        }
        res.status(200).send(userRes);
    })();
}


module.exports = {
     addProfileDetails, getProfileDetails
}