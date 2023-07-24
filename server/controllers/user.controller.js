const db = require('../models/index');
const User = db.User;
const Application = db.Application;
const ApplicationStatus = db.application_status;
const AppQuestion = db.app_question;
const Question = db.question;
const Category = db.category;
const Answers = db.answers;
const ApplicationInvite = db.application_invite;
const generateToken = require('../config/jwt.config');
const seq = require('../config/sequelize.config');
const { Op, where } = require("sequelize");
const sendEmail = require('../config/mail.config');
// const PDFDocument = require('pdfkit');
const fs = require('fs');
// const image = '../../client/public/images/';
// const image = './6_Surf-Logo 2_c3bd0a2a.png';
const path = require('path');
// const jsPDF = require('jspdf');
const pdfCreatorNode = require("pdf-creator-node");
// const generateHTML = require('./pdf.controller')

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
    const limit = req.query.limit ? Number(req.query.limit) : null;
    const offset = req.query.offset ? Number(req.query.offset) : 0;
    const filters = req.query.filters;
    console.log("Filters-", filters);
    let filterData = [];
    const filterStatus = filters?.status ? filters.status : [];
    let filterCategory;
    if (filters?.answer) {
        if (filters.answer === "Other") {
            filterCategory = { [Op.not]: ['Fabric clean(FCL)', 'Fabric Enhancer(FEN)', 'Home & Hygiene(H&H)'] };
        } else {
            filterCategory = { [Op.eq]: filters.answer };
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
                    // model: AppQuestion, attributes: ['id', 'app_id', 'question_id'], include: [{ model: Answers, attributes: ['id', 'question_id', 'answer'] }]
                },
                { model: ApplicationInvite, attributes: ["id"], include: { model: User, attributes: ["id", "email", "first_name", "last_name"] } }
            ],
            [['updatedAt', 'DESC']], limit, offset
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
    const limit = req.query.limit ? Number(req.query.limit) : null;
    const offset = req.query.offset ? Number(req.query.offset) : 0;

    let filterData = [];
    let filterCategory;
    if (filters?.answer) {
        if (filters.answer === "Other") {
            filterCategory = { [Op.not]: ['Fabric clean(FCL)', 'Fabric Enhancer(FEN)', 'Home & Hygiene(H&H)'] };
        } else {
            filterCategory = { [Op.eq]: filters.answer };
        }
        filterData.push({ '$app_questions.answers.answer$': filterCategory });
    }
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
                { model: ApplicationInvite, attributes: ["id"], include: { model: User, attributes: ["id", "email", "first_name", "last_name"] } }
            ],
            [['updatedAt', 'DESC']], limit, offset
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
                // { model: Question, attributes: ["id", "category_id", "question_type_id", "question", "status", "parent_id"], include: [{model: Category, attributes: ['id', 'name']}] },
                { model: Answers, attributes: ["id", "app_question_id", "answer"] }
            ]
        );
        // const AppQuesRes = await seq.seqFindAll(Question, ["id","category_id", "question_type_id", "question", "status", "parent_id"],{},
        //     [
        //        {model: Category, attributes: ['id', 'name'] },
        //        {model : AppQuestion, attributes: ["id", "question_id", "app_id"], include:[{ model: Answers, attributes: ["id", "app_question_id", "answer"] }]  },

        //     ]
        // );
        //console.log("RESPONSE: ", AppQuesRes);
        res.status(200).send({ Application: AppData, QueAns: AppQueRes });
    })();
}

/*function getExportPDF(req, res){
    const app_id = req.params.app_id;
    (async () => {
        const appData = await seq.seqFindByPk(Application, app_id, ["id", "project_name", "application_status_id", "updated_at"],
            [
                { model: User, attributes: ['id', 'unique_id', "first_name", "last_name", "email"] },
                { model: ApplicationStatus, attributes: ['id', 'status'] },
                { model: ApplicationInvite, attributes: ["id"], include: { model: User, attributes: ["id", "email", "first_name", "last_name"] } }
            ]
        );
        if (appData === 500) return res.status(500).send({ message: "Error while getting application" });
        const appQueRes = await seq.seqFindAll(AppQuestion, ["id", "question_id", "app_id"], { app_id: app_id },
            [
                { model: Question, attributes: ["id", "category_id", "question_type_id", "question", "status", "parent_id"], include: [{model: Category, attributes: ['id', 'name']}] },
                { model: Answers, attributes: ["id", "app_question_id", "answer"]}
            ]
        );
        if (appQueRes === 500) return res.status(500).send({ message: "Error while getting application" });
        
        

        const doc = new PDFDocument();
        const outputPath = 'output.pdf'; // Set the output file path
        const stream = fs.createWriteStream(outputPath); // Pipe the PDF document to a writable stream
        doc.pipe(stream);
    
        doc.fontSize(14).font('Helvetica-Bold').text(`Project Name: ${appData.project_name}`);
        doc.fontSize(14).font('Helvetica-Bold').text(`Status: ${appData.application_status.status}`).moveDown(0.7);

        const categoryWiseQuesData = getCatWiseQues(appQueRes);
    // console.log(categoryWiseQuesData[0].category_name);
        
        categoryWiseQuesData.forEach((category) => {
        //console.log(category.questions);
        doc.fillColor('black');

        doc.fontSize(16).fillColor('#002F98').text(`${category.category_id}. ${category.category_name}`,{continued: false,}).moveDown(0.5);

        category.questions.forEach((que)=> {
            
            //console.log(que);
            doc.fontSize(12).fillColor('#03297D').text(`${que.CatWiseQueIndex} ${que.question.question}`, {continued: false}).moveDown(0.5);
            switch (que.question.question_type_id) {
                case 1: // TextBox
                 que.answers.forEach((newAns,i) => doc.fillColor('black').text(`${newAns.answer}`,{continued: false, }).moveDown(0.5));
                break;
                case 3: //Select Dropdown predefined
                case 4: // Select Dropdown dynamic
                 que.answers.forEach((newAns,i) => doc.fillColor('black').text(`${newAns.answer}`,{continued: false}).moveDown(0.5));
                 break;
                case 5: //Multiselect Dropdown predefined
                case 6: // Multiselect dropdown dynamic
                 que.answers.forEach((newAns, i) => doc.fillColor('black').text(`${newAns.answer}`,{continued: false}).moveDown(0.5));
                 break;
                case 14: //Select (projectName) with TextBox
                //console.log("Que-type", que.question.question_type_id);
                     que.answers.forEach((ans, i) => {
                      const ansObj = JSON.parse(ans.answer);
                        doc.fillColor('black').text(`${ansObj.option}`,{continued: false}).moveDown(0.5);
                        doc.fillColor('black').text(`${ansObj.projectName}`,{continued: false}).moveDown(0.5); 
                    });
                    break;
                case 7:  // Picture choice predefined
                    que.answers.forEach((ans) => {
                        const ansObj = JSON.parse(ans.answer);
                        // const imagePath = path.join(__dirname, '../controllers/public', 'brand_robjin.png');
                        // console.log(`${image}`);
                        // const imagePath = path.join(__dirname, '../client/public/images/');
                        //console.log(imagePath);
                        //  doc.image(`${image}${ansObj.brand}`);
                        //  doc.image('public/testimg.jpg',{fit: [250, 300],
                        //  align: 'center',
                        //  valign: 'center'});
                        //  <img src={`/images/${ansObj.brand}`} alt={ansObj.brand} />
                        {ansObj.desc && doc.fillColor('black').text(`${ansObj.desc}`,{continued: false}).moveDown(0.5)}
                    })
                    break;
                case 8: // Multiselect Picture Choice
                    if(que.question.id === 23){
                        const ansObj = JSON.parse(que.answers[0].answer);
                        {ansObj.option.forEach((opt, i) => doc.fillColor('black').text(`${opt}`,{continued: false}).moveDown(0.5))}
                        {ansObj.desc && doc.fillColor('black').text(`Description: ${ansObj.desc}`,{continued: false}).moveDown(0.5)}
                    } else {
                        que.answers.forEach((newAns, i) => doc.fillColor('black').text(`${newAns.answer}`,{continued: false}).moveDown(0.5));
                    }
                    break;
                case 9: 
                    que.answers.forEach((newAns)=> {
                        const ansObj = JSON.parse(newAns.answer);
                        doc.fillColor('black').text(`${ansObj.variation}`,{continued: false}).moveDown(0.5);
                        //{ansObj.files.forEach((img)=> {
                            // console.log("img", img);
                            //const imagePath = path.resolve('public', img);
                            // console.log("Path: ", imagePath);
                            // const imageAsBase64 = fs.readFileSync(imagePath, 'base64');
                            //imagePath = imagePath.replace(new RegExp(/\\/g),'/')
                            // console.log(`./public/${img}`);
                            // doc.image(`data:image;base64,${imageAsBase64}`);
                            // doc.file(imageAsBase64);
                        //})}
                    })
                    break;
                case 13: // Add Multiple section Image Upload
                    que.answers.forEach((newAns) => {
                        const ansObj = JSON.parse(newAns.answer);
                        doc.fillColor('black').text(`${ansObj.desc}`,{continued: false}).moveDown(0.5);
                        // {ansObj.files.forEach((img)=> {
                        //     // console.log("img", img);
                        //     const imagePath = path.resolve('public', img);
                        //     console.log("Path: ", imagePath);
                        //     const imageAsBase64 = fs.readFileSync(imagePath, 'base64');
                        //     //imagePath = imagePath.replace(new RegExp(/\\/g),'/')
                        //     // console.log(imageAsBase64);
                        //     doc.image(`data:image;base64,${imageAsBase64}`);
                        //     // doc.file(imageAsBase64);
                        // })}
                    })
                    break;
                case 10: // Single Choice predefinded
                if(que.question.id === 24){
                    const ansObj = JSON.parse(que.answers[0].answer);
                    {ansObj.option && doc.fillColor('black').text(`Investment: ${ansObj.option}`,{continued: false}).moveDown(0.5)}
                    {ansObj.amount && doc.fillColor('black').text(`Amount: € ${ansObj.amount} Cost per tons (in Euros)`,{continued: false}).moveDown(0.5)}
                } else {
                    que.answers.forEach((newAns, i) => doc.fillColor('black').text(`${newAns.answer}`,{continued: false}).moveDown(0.5));
                }
                    break;
                    // case 12: // Nested questions
                    // if(que.question.id === 7){

                    // } else {

                    // }
                    // break;
                    case 11: // Multiple Choice (Checkbox) predefined
                    case 15: // Confirm Checkbox
                    case 2: // Date
                    default:
                    que.answers.forEach((newAns,i) => doc.fillColor('black').text(`${newAns.answer}`,{continued: false}).moveDown(0.5));
                    break;
              }    
        })
    })

    doc.end();

    res.contentType("application/pdf");
    res.attachment("output.pdf");
    fs.createReadStream(outputPath).pipe(res);
        // res.status(200).send({Application: appData, QuesAns : appQueRes});
    })();
}*/
function getExportPDF(req, res) {
    var template = fs.readFileSync(path.join(__dirname, '../export.html'), 'utf8');
    var options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
    };
    const app_id = req.params.app_id;
    (async () => {
        const appData = await seq.seqFindByPk(Application, app_id, ["id", "project_name", "application_status_id", "updated_at"],
            [
                { model: User, attributes: ['id', 'unique_id', "first_name", "last_name", "email"] },
                { model: ApplicationStatus, attributes: ['id', 'status'] },
                { model: ApplicationInvite, attributes: ["id"], include: { model: User, attributes: ["id", "email", "first_name", "last_name"] } }
            ]
        );
        if (appData === 500) return res.status(500).send({ message: "Error while getting application" });
        const appQueRes = await seq.seqFindAll(AppQuestion, ["id", "question_id", "app_id"], { app_id: app_id },
            [
                { model: Question, attributes: ["id", "category_id", "question_type_id", "question", "status", "parent_id"], include: [{ model: Category, attributes: ['id', 'name'] }] },
                { model: Answers, attributes: ["id", "app_question_id", "answer"] }
            ]
        );
        if (appQueRes === 500) return res.status(500).send({ message: "Error while getting application" });

        //console.log(template)
        const appQues = getCatWiseQues(appQueRes);
        // console.log('appQues',appQues);
        var document = {
            html: template,
            data: {
                project_name: appData.project_name,
                application_status: appData.application_status.status,
                appQue: appQues
            },
            path: './dhruvi.pdf',

        }
        pdfCreatorNode.create(document, options).then((res) => {
            console.log(res);
        })
        // console.log(document.data);

    })();
}

function getExportPDFNew(req, res) {
    var template = fs.readFileSync(path.join(__dirname, '../export.html'), 'utf8');
    var options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
    };
    const app_id = req.params.app_id;
    (async () => {
        // const appData = await seq.seqFindByPk(Application, app_id, ["id", "project_name", "application_status_id", "updated_at"],
        //     [
        //         { model: User, attributes: ['id', 'unique_id', "first_name", "last_name", "email"] },
        //         { model: ApplicationStatus, attributes: ['id', 'status'] },
        //         { model: ApplicationInvite, attributes: ["id"], include: { model: User, attributes: ["id", "email", "first_name", "last_name"] } }
        //     ]
        // );
        // if (appData === 500) return res.status(500).send({ message: "Error while getting application" });
        // const appQueRes = await seq.seqFindAll(AppQuestion, ["id", "question_id", "app_id"], { app_id: app_id },
        //     [
        //         { model: Question, attributes: ["id", "category_id", "question_type_id", "question", "status", "parent_id"], include: [{ model: Category, attributes: ['id', 'name'] }] },
        //         { model: Answers, attributes: ["id", "app_question_id", "answer"] }
        //     ]
        // );
        // if (appQueRes === 500) return res.status(500).send({ message: "Error while getting application" });

        // //console.log(template)
        // const appQues = getCatWiseQues(appQueRes);


        const categories = (await seq.seqFindAll(Category, ['id', 'name'])).map(o => o.dataValues);
        const questions = (await seq.seqFindAll(Question, ['id', 'category_id', 'question_type_id', 'question', 'parent_id'])).map(o => o.dataValues);
        const appQuestions = (await seq.seqFindAll(AppQuestion, ['id', 'question_id'], { app_id: app_id })).map(o => o.dataValues.id);
        const answers = (await seq.seqFindAll(Answers, ['question_id', 'answer'], { app_question_id: appQuestions })).map(o => o.dataValues);
        console.log('appQues', categories, appQuestions, answers
            // appQues.map(el => el.questions = el.questions.map(o => o.dataValues).map(e => e.question.dataValues))
        );
        const finalRes = getFinalExport(categories, questions, answers);
        var document = {
            html: template,
            data: {
                // project_name: appData.project_name,
                // categories: categories,
                finalRes: finalRes,
                // application_status: appData.application_status.status,
                // appQue: appQues,
            },
            path: './application_' + app_id + '.pdf',

        }
        pdfCreatorNode.create(document, options)
            .then((filepath) => {
                console.log('document', filepath);
                res.status(200).sendFile(filepath.filename);
            }).catch((error) => {
                console.error(error);
                res.status(500).send("PDF could not be created");
            });
        // console.log(document.data);

        // res.status(200).send({ finalRes });
    })();
}

const getFinalExport = (categories, questions, answers) => {
    categories.map((cat, catIndex) => {
        cat.no = catIndex + 1;
        cat.questions = questions.filter(el => el.category_id == cat.id);
        let queCounter = 1;
        cat.questions.map((que, queIndex) => {
            que.answers = answers.filter(el => el.question_id == que.id);
            if (que.answers.length > 0) {
                if (que.id == 1) {
                    let values = Object.values(JSON.parse(que.answers[0].answer));
                    que.answers = values.map(ob => ob = { question_id: que.answers[0].question_id, answer: ob });
                } else if (que.id == 15) {
                    let values = Object.values(JSON.parse(que.answers[0].answer));
                    que.answers = values.map((ob, index) => ob = index == 0 ?
                        { question_id: que.answers[0].question_id, ans_type: 'image', answer: fs.readFileSync(__dirname + '/../../client/public/images/' + ob).toString('base64') }
                        : { question_id: que.answers[0].question_id, answer: ob });
                } else if (que.id == 23) {
                    let values = Object.values(JSON.parse(que.answers[0].answer)).flat();
                    que.answers = values.map((ob, index) => ob = {
                        question_id: que.answers[0].question_id,
                        answer: (index == values.length - 1 ? "Description: " : "") + ob
                    });
                } else if (que.id == 24) {
                    let values = Object.values(JSON.parse(que.answers[0].answer));
                    que.answers = values.map((ob, index) => ob = {
                        question_id: que.answers[0].question_id,
                        answer: (index == 0 ? "Investment: " + ob : "Amount: €" + ob + " Cost per tons (in Euros)")
                    });
                } else if (que.id == 27 || que.id == 28 || que.id == 29) {
                    que.answers = que.answers.map(ans =>
                        Object.values(JSON.parse(ans.answer)).flat().map((ob, index) => ob = index == 0 ?
                            { question_id: que.answers[0].question_id, answer: ob }
                            : {
                                question_id: que.answers[0].question_id, ans_type: 'image',
                                answer: fs.readFileSync(__dirname + '/../public/' + ob).toString('base64')
                            })
                    ).flat();
                }
            } else {
                (que.id != 7 && que.id != 11) && delete cat.questions[queIndex];
            }
            que.no = que.id <= 7 || que.id == 11 || que.id >= 15 ? (cat.no + '.' + queCounter++) : 0;
        });
    });
    return categories;
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
    const limit = req.query.limit ? Number(req.query.limit) : null;
    const offset = req.query.offset ? Number(req.query.offset) : 0;
    //console.log("Filters-",filters);
    let filterData = [];
    let filterCategory;
    if (filters?.answer) {
        if (filters.answer === "Other") {
            filterCategory = { [Op.not]: ['Fabric clean(FCL)', 'Fabric Enhancer(FEN)', 'Home & Hygiene(H&H)'] };
        } else {
            filterCategory = { [Op.eq]: filters.answer };
        }
        filterData.push({ '$app_questions.answers.answer$': filterCategory });
    }
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
        if (invitedApp === 500) return res.status(500).send({ message: "Error while getting Collaborator" });
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
                { model: ApplicationInvite, attributes: ["id"], include: { model: User, attributes: ["id", "email", "first_name", "last_name"] } }
            ],
            [['updatedAt', 'DESC']], limit, offset
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

function getCatWiseQues(questions) {
    const result = [];
    // let count = 0;
    let CatWiseQueIndex;

    for (let i = 0; i < questions.length; i++) {
        const que = questions[i];

        if (result[que.question.category_id - 1]) {
            CatWiseQueIndex += 1;
            result[que.question.category_id - 1].questions.push({
                ...que,
                //   serial: count++,
                CatWiseQueIndex: `${que.question.category_id}.${CatWiseQueIndex}`
            });
        } else {
            CatWiseQueIndex = 1;
            result[que.question.category_id - 1] = {
                category_id: que.question.category_id,
                category_name: que.question.category.name,
                //   serial: count++,
                questions: [{
                    ...que,
                    // serial: count++,
                    CatWiseQueIndex: `${que.question.category_id}.${CatWiseQueIndex}`
                }]
            };
        }
    }

    return result;
}

module.exports = {
    addProfileDetails,
    getProfileDetails,
    updateProfile,
    getMyApplications,
    getApprovedApplications,
    viewApplications,
    getExportPDF,
    getExportPDFNew,
    getInvitedApplications
}