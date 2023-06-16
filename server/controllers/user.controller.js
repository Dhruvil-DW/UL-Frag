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
const sendEmail = require('../config/mail.config');

function addProfileDetails(req, res) {
    // console.log(req.body);
    const userId = req.userdata.user_id;
    //console.log(userId);
    (async () => {
        //console.log('uSERS id',userId)
        const tokenData = {
            id: userId,
            unique_id: "frag_usr_" + userId,
            role_id: 1,
            email: req.userdata.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name
        };
        console.log('token data - ', tokenData);
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
    console.log("MY APPLICATION");
    const userId = req.userdata.user_id;
    const role_id = req.userdata.role_id;
    //console.log("QUERY: ", req.query);
    const searchText = req.query.search;
    // console.log(searchText);
    const filters = req.query.filters;
    console.log("Filters-",filters);
    let filterData = [];
    const filterStatus = filters?.status ? filters.status : [];
    let filterCategory;
    if(filters?.answer) {
        if(filters.answer === "Other") {
            filterCategory = { [Op.not]: ['Fabric clean(FCL)', 'Fabric Enhancer(FEN)', 'Home & Hygiene(H&H)']};
        } else {
            filterCategory = { [Op.eq]: filters.answer};
        }
        filterData.push({ '$app_questions.answers.answer$': filterCategory });
    }
    filterStatus.length != 0 && filterData.push({ '$application_status.status$': { [Op.or]: filterStatus } });
     console.log("FilterData", filterData);
    const searchCond = searchText ? {
        [Op.and]: filterData, [Op.or]: [
            { project_name: { [Op.like]: '%' + searchText + '%' } }
        ]
    } : filters ? { [Op.and]: filterData } : {};
    console.log("searchCond", searchCond);
    console.log({ userId });
    console.log({ role_id });
    (async () => {

        const whereCond = role_id === 2 ? { application_status_id: [2, 4], ...searchCond } : { user_id: userId, ...searchCond }
        console.log("whereCond", whereCond);
        const applRes = await seq.seqFindAll(
            Application,
            ['id', 'project_name', 'application_status_id', 'user_id', 'status', 'updatedAt'],
            whereCond,
            [
                { model: ApplicationStatus, attributes: ['id', 'status'] },
                { model: User, attributes: ['id', 'first_name', 'last_name', 'email'] },
                {
                    model: AppQuestion, attributes: ['id', 'app_id', 'question_id'], where: { question_id: 3 }, include: [{ model: Answers, attributes: ['id', 'question_id', 'answer'] }]
                },
            ],
            [['updatedAt', 'DESC']]
        );
        if (applRes === 500) return res.status(500).send({ message: 'Error while retrieving applications' });

        res.status(200).send(applRes);
    })();
}

function getApprovedApplications(req, res) {
    const searchText = req.query.search;
    console.log("Query-", req.query);
    const filters = req.query.filters;
    console.log("Filters-", filters);
    const filterCategory = filters?.answer ? filters.answer : '';
    console.log("filterCategory", filterCategory);
    let filterData = [];
    // filterCategory.length != 0 && filterData.push({'$app_question.answers.answer$': {[Op.or]: filterCategory}});
    filterCategory.length != 0 && filterData.push({ '$app_questions.answers.answer$': { [Op.eq]: filterCategory } });
    console.log("FilterData", filterData);
    const searchCond = searchText ? {
        [Op.and]: filterData,
        [Op.or]: [
            { project_name: { [Op.like]: '%' + searchText + '%' } }
        ]
    } : filters ? { [Op.and]: filterData } : {};
    console.log("SearchCond: ", searchCond);
    (async () => {
        const approveRes = await seq.seqFindAll(Application, ['id', 'project_name', 'application_status_id', 'user_id', 'status'], { application_status_id: 3, ...searchCond },
            [
                { model: ApplicationStatus, attributes: ['id', 'status'] },
                { model: User, attributes: ['id', 'first_name', 'last_name', 'email'] },
                {
                    model: AppQuestion, attributes: ['id', 'app_id', 'question_id'], where: { question_id: 3 }, include: [{ model: Answers, attributes: ['id', 'question_id', 'answer'] }]
                },

            ],
            [['updatedAt', 'DESC']]
        );
        // console.log("Approvr-", approveRes);
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

function sendInviteApplication(req, res) {

    const app_id = req.params.app_id;
    const emailArr = req.body;
    const user_id = req.userdata.user_id;
    // console.log({ userId });
    // console.log({ app_id });
    // console.log({ emailArr });

    (async () => {

        const applicationRes = await seq.seqFindByPk(Application, app_id, ["id", "project_name"], { model: User, attributes: ["id", "first_name", "last_name"] });

        //**Get Already Invited Collabrator for this App_ID
        const existCollabrator = await seq.seqFindAll(ApplicationInvite, ["user_id"], { app_id: app_id });
        if (existCollabrator === 500) return res.status(500).send({ message: "Error while getting Collabrator" });
        const existCollabUserIdArr = existCollabrator.map(obj => obj.user_id);
        // console.log("existCollabrator: ", existCollabrator);
        // console.log("existCollabUserIdArr: ", existCollabUserIdArr);

        //**Iterate on New Invited Email ID
        await emailArr.map(async (email) => {
            // console.log("EMAIL ID: ",email);
            let user;
            //**Check this Email is already User or not
            const userExist = await seq.seqFindOne(User, ['id'], { email: email });
            if (userExist === 500) return res.status(500).send({ message: "Error while getting EmailID" });

            if (userExist) {
                //**Yes Already User
                // console.log("Already User");
                if (existCollabUserIdArr.includes(userExist.id) || userExist.id === user_id) {
                    //**This user already invited or User itself so skip this and continue over next Email
                    // console.log("Already Collabrator");
                    return null;
                }
                user = userExist.id;
            } else {
                //**New Email ID
                // console.log("New User");
                const newUser = { email: email, role_id: 0 };
                const addUserRes = await seq.seqCreate(User, newUser);
                if (addUserRes === 500) return res.status(500).send({ message: "Error while creating User" });

                user = addUserRes.id;
            }

            //**add Entry in App_Invite
            const newAppInviteData = { app_id: app_id, user_id: user };
            const appInviteRes = await seq.seqCreate(ApplicationInvite, newAppInviteData);
            if (appInviteRes === 500) return res.status(500).send({ message: "Error while creating Invite" });

            //**Send Email */
            const fullName = `${applicationRes.User?.first_name ?? ""} ${applicationRes.User?.last_name ?? ""}`;
            const projectName = `${applicationRes.project_name ?? ""}`;
            sendEmail([email], `You have been Invited`,
                `<p>Hello,</p>
                <section>
                    <div>You have been invited to collabrate with <b>${fullName}</b> for project <b>${projectName}</b>.</div>
                    <div>Click on below button to Login.</div>
                    <a target="_blank" href="http://13.235.224.103/login">
                        <button style="
                            cursor: pointer;
                            background-color:transparent;
                            border: 1px solid blue;
                            color: blue;
                            border-radius: 16px;
                            padding: 8px 16px;
                            margin: 8px;
                        ">Click to Login</button>
                    </a>
                </section>`
            )
        });

        res.status(200).send({ message: "Collabrator added successfully" });
    })();
}

function getInvitedApplications(req, res) {
    console.log("GET_INVITED_APP");
    const userId = req.userdata.user_id;
    const role_id = req.userdata.role_id;
    if (role_id !== 1) return res.status(401).send({ message: "Unauthorized User" });
    //console.log("QUERY: ", req.query);
    const searchText = req.query.search;
    console.log(searchText);
    const filters = req.query.filters;
    //console.log("Filters-",filters);
    let filterData = [];
    // const filterStatus = filters?.status ? filters.status : [];
    const filterCategory = filters?.answer ? filters.answer : '';
    //console.log('Filtercategory', filterCategory);
    // filterStatus.length != 0 && filterData.push({ '$application_status.status$': { [Op.or]: filterStatus } });
    filterCategory.length != 0 && filterData.push({ '$app_questions.answers.answer$': { [Op.eq]: filterCategory } });

    //console.log("FilterData", filterData);
    const searchCond = searchText ? {
        [Op.and]: filterData,
        [Op.or]:
            [
                { project_name: { [Op.like]: '%' + searchText + '%' } }
            ]
    } : filters ? { [Op.and]: filterData } : {};
    (async () => {

        //**Get Already Invited Collabrator for this App_ID
        const invitedApp = await seq.seqFindAll(ApplicationInvite, ["app_id", "user_id"], { user_id: userId });
        if (invitedApp === 500) return res.status(500).send({ message: "Error while getting Collabrator" });
        const invitedAppIdArr = invitedApp.map(obj => obj.app_id);
        console.log("invitedAppIdArr: ", invitedAppIdArr);
        const whereCond = { id: invitedAppIdArr, ...searchCond }

        const applRes = await seq.seqFindAll(
            Application,
            ['id', 'project_name', 'application_status_id', 'user_id', 'status', 'updatedAt'], //Change the column updatedAt name if causes error here
            whereCond,
            [
                { model: ApplicationStatus, attributes: ['id', 'status'] },
                { model: User, attributes: ['id', 'first_name', 'last_name', 'email'] },
                {
                    model: AppQuestion, attributes: ['id', 'app_id', 'question_id'], where: { question_id: 3 }, include: [{ model: Answers, attributes: ['id', 'question_id', 'answer'] }]
                },
            ],
            [['updatedAt', 'DESC']]
        );
        if (applRes === 500) return res.status(500).send({ message: 'Error while retrieving applications' });

        res.status(200).send(applRes);
    })();

    //**Old
    // const user_id = req.userdata.user_id;
    //console.log(user_id);
    // (async () => {
    //     const getInviteRes = await seq.seqFindAll(ApplicationInvite, ['id', 'app_id', 'user_id'], { user_id: user_id },
    //         [
    //             { model: User, attributes: ['id', 'first_name', 'last_name', 'email'] },
    //             { model: Application, attributes: ['id'] },
    //         ]
    //     )
    //     //console.log(getInviteRes);
    //     if (getInviteRes === 500) {
    //         res.status(500).send({ message: "Error while retrieving invited applications" });
    //     }
    //     res.status(200).send(getInviteRes);
    // })();
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