const db = require('../models/index');
const Question = db.question;
const Application = db.Application;
const User = db.User;
const ApplicationStatus = db.application_status;
const AppQuestion = db.app_question;
const Answers = db.answers;
const seq = require('../config/sequelize.config');
const { Op } = require('sequelize');

function approveRejectApplication(req,res){
    const app_id = req.params.app_id;
    const type = req.params.type;
    const role_id = req.userdata.role_id;
    if(role_id !== 2){
        res.status(401).send({message:'Unauthorised user'});  
        return;
    }
(async () => {
    const data = {};
    let message = '';
        if(type == 'Approved'){
            data.application_status_id = 3;
            message = 'Application has been approved';
        } else if(type == 'Rejected'){
            data.application_status_id = 4;
            message = 'Application has been rejected';
        }
        
        // console.log("RESPONSE: ", );
        const ApplData = await seq.seqUpdate(Application, data, {id:app_id});
        // console.log(ApplData);
        if(ApplData === 500){
            res.status(500).send({message:'Error while approving application'});
        }
        res.status(200).send({message:message});
})();
}

module.exports = {
    approveRejectApplication
}