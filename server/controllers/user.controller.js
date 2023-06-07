const db = require('../models/index');
const User = db.User;
const Application = db.Application;
const ApplicationStatus = db.application_status;
const AppQuestion = db.app_question;
const Question = db.question;
const Answers = db.answers;
const ApplicationInvite = db.application_invite;
const generateToken = require('../config/jwt.config');
const seq = require('../config/sequelize.config');
const { Op } = require("sequelize");

function addProfileDetails(req, res) {
    //console(req.body);
    const userId = req.userdata.user_id;
    //console.log(userId);
    (async () => {
        //console.log('uSERS id',userId)
        const tokenData = {
            id: userId,
            unique_id: "frag_usr_" + userId,
            role_id: 1,
            email: req.userdata.email
        };
        console.log('token data - ',tokenData);
        const token = await generateToken(tokenData);
        const userData = {
            unique_id: "frag_usr_" + userId,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            // contact_no: req.body.contact_no,
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
        res.status(200).send({ message: "User successfully added", token: token });
    })();
}

function getProfileDetails(req, res) {
    //console.log(req.userdata.user_id);
    (async () => {
        const userRes = await seq.seqFindByPk(User, req.userdata.user_id, ['id', 'unique_id', 'first_name', 'last_name', 'email', 'role_id']);
        if (userRes === 500) {
            res.status(500).send({ message: "Error while getting profile details" });
            return;
        }
        res.status(200).send(userRes);
    })();
}

function updateProfile(req, res) {
    const userId = req.userdata.user_id;
    (async () => {
        const userData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            // contact_no: req.body.contact_no,
        }
        const updateRes = await seq.seqUpdate(User, userData, { id: userId });
        if (updateRes === 500) {
            res.status(500).send({ message: "Error while updating profile details" });
            return;
        }
        res.status(200).send({ message: "User updated successfully" });
    })();
}

function getMyApplications(req, res) {
    const userId = req.userdata.user_id;
    (async () => {
        const applRes = await seq.seqFindAll(
            Application,
            ['id', 'project_name', 'application_status_id', 'user_id', 'status', 'updatedAt'], //Change the column updatedAt name if causes error here
            { user_id: userId },
            [
                { model: ApplicationStatus, attributes: ['id', 'status'] },
                { model: User, attributes: ['id', 'first_name', 'last_name', 'email'] },
            ]
        );
        if (applRes === 500) {
            res.status(500).send({ message: 'Error while retrieving applications' });
            return;
        }
        res.status(200).send(applRes);
    })();
}

function getApprovedApplications(req, res) {
    (async () => {
        const approveRes = await seq.seqFindAll(Application, ['id', 'project_name', 'application_status_id', 'user_id', 'status'], { application_status_id: 3 }, { model: ApplicationStatus, attributes: ['id', 'status'] });
        if (approveRes === 500) {
            res.status(500).send({ message: "Error while retrieving the list of approved applications" });
            return;
        }
        res.status(200).send(approveRes);
    })();

}
function viewApplications(req, res) {
    const app_id = req.params.app_id;
    (async () => {
        const AppData = await seq.seqFindByPk(Application, app_id, ["id", "project_name", "application_status_id", "updated_at"],
            [
                { model: User, attributes: ['id', 'unique_id', "first_name", "last_name", "email"] },
                { model: ApplicationStatus, attributes: ['id', 'status'] },
            ]
        );
        if (AppData === 500) return res.status(500).send({ message: "Error while getting application" });

        const AppQueRes = await seq.seqFindAll(AppQuestion, ["id", "question_id", "app_id"], { app_id: app_id },
            [
                { model: Question, attributes: ["id", "category_id", "question_type_id", "question", "status", "parent_id"] },
                { model: Answers, attributes: ["id", "app_question_id", "answer"] },
            ]
        );
        // console.log("RESPONSE: ", );
        res.status(200).send({ Application: AppData, QueAns: AppQueRes });
    })();
}
function sendInviteApplication(req,res){
    const userId = req.userdata.user_id;
    //console.log(userId);
    const app_id = req.params.app_id;
    //console.log(app_id);
    (async() => { 
            const inviteRes = await seq.seqBulkCreate(ApplicationInvite, [{app_id:app_id, user_id:userId}]);
            //console.log("INVITERESP-", inviteRes);
            if(inviteRes === 500){
                res.status(500).send({message:'Error while sending the invite'});
            }
        res.status(200).send({message:'Application invite sent successfully'});
    })();
}

function getInvitedApplications(req,res){
    const user_id = req.userdata.user_id;
    //console.log(user_id);
    (async () => {
        const getInviteRes = await seq.seqFindAll(ApplicationInvite, ['id', 'app_id', 'user_id'],{user_id:user_id}, {model:User, attributes:['id', 'first_name', 'last_name', 'email']});
        //console.log(getInviteRes);
        if(getInviteRes === 500){
            res.status(500).send({message:"Error while retrieving invited applications"});
        }
        res.status(200).send(getInviteRes);
    })();
}
module.exports = {
    addProfileDetails, 
    getProfileDetails, 
    updateProfile, 
    getMyApplications, 
    getApprovedApplications, 
    viewApplications, 
    sendInviteApplication,
    getInvitedApplications
}