const db = require('../models/index');
const User = db.User;
const Application = db.Application;
const ApplicationStatus = db.application_status;
const AppQuestion = db.app_question;
const Question = db.question;
const Answers = db.answers;
const generateToken = require('../config/jwt.config');
const seq = require('../config/sequelize.config');

function addProfileDetails(req, res) {
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
            unique_id: "frag_usr_" + userId,
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
        res.status(200).send({ message: "User successfully added", token: token });
    })();
}

function getProfileDetails(req, res) {
    (async () => {
        const userRes = await seq.seqFindByPk(User, req.userdata.user_id, ['id', 'unique_id', 'first_name', 'last_name', 'email', 'contact_no', 'role_id']);
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
            contact_no: req.body.contact_no,
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
            ['id', 'project_name', 'application_status_id', 'user_id', 'status', 'updatedAt'], 
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
function viewApplications(req,res){
    const app_id = req.params.app_id;
    (async () => {
    const appQues = [];
       const appQuesRes = await seq.seqFindAll(AppQuestion, ['id', 'app_id', 'question_id'],{app_id:app_id});
       console.log(appQuesRes);
       appQuesRes.forEach((items)=> {
        //console.log(items.dataValues.id);
        appQues.push(items.dataValues.id);
       });
       //console.log(appQues);
       //console.log(appQuesRes.dataValues);
       const viewRes = await seq.seqFindAll(Answers, ['id', 'question_id', 'answer', 'app_question_id'], {app_question_id:appQues}, {model:Question, attributes:['id','question']});
       //console.log("VIEWRES-", viewRes);
       if(viewRes === 500){
        res.status(500).send({message:"Error while retrieving the view applications"});
        return;
       }
       res.status(200).send(viewRes); 
    })();
}
module.exports = {
    addProfileDetails, getProfileDetails, updateProfile, getMyApplications, getApprovedApplications, viewApplications
}