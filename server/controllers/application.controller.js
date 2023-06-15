const db = require("../models/index");
const User = db.User;
const Question = db.question;
const Category = db.category;
const Region = db.region;
const Country = db.country;
const Application = db.Application;
const Answers = db.answers;
const AppQuestion = db.app_question;
const ApplicationStatus = db.application_status;
const seq = require("../config/sequelize.config");
const { Op } = require("sequelize");
const { ifError } = require("assert");

function getAllQuestions(req, res) {
  (async () => {
    const getRes = await seq.seqFindAll(Question, ["id", "category_id", "question", "question_type_id", "question_opt", "status", "description"], { parent_id: 0, status: { [Op.not]: 0 } }, { model: Category, attributes: ["id", "name"] });
    const quesRes = await seq.seqFindAll(Question, ["id", "category_id", "question", "parent_id", "question_type_id", "question_opt", "status", "description"], { parent_id: { [Op.not]: 0 }, status: { [Op.not]: 0 } }, { model: Category, attributes: ["id", "name"] });
    //console.log(quesRes.id);
    const childData = {};

    quesRes.forEach((item) => {
      const parentID = item.dataValues.parent_id;
      item.dataValues.question_opt = JSON.parse(item.dataValues.question_opt);
      if (childData[parentID]) {
        childData[parentID] = [...childData[parentID], item];
      } else {
        childData[parentID] = [item];
      }
    });
    Object.keys(childData).forEach(qId => {
      getRes.forEach((que, index) => {
        //console.log("QUES ID: ",que.id);
        //console.log("Q ID: ",qId);
        if (que.id == qId) {
          //console.log("INDEX-", getRes[index].dataValues);
          getRes[index].dataValues.nestedQue = childData[qId];
        }
      });
    })
    // console.log("GETRESP-", getRes);
    if (getRes === 500) {
      res.status(500).send({ message: "Error while retrieving the questions" });
    } else {
      getRes.map((o) => {
        o.question_opt = JSON.parse(o.question_opt);
      });
      res.status(200).send(getRes);
    }
  })();
}

function getRegionNames(req, res) {
  (async () => {
    const regRes = await seq.seqFindAll(Region, ["id", ["region_name", "label"]]);
    if (regRes === 500) {
      res.status(500).send({ message: "Error while getting region names" });
    } else {
      res.status(200).send(regRes);
    }
  })();
}
function getCountryNames(req, res) {
  //console.log(req);
  const regionId = req.params.region_id;
  console.log(regionId);
  (async () => {
    const countRes = await seq.seqFindAll(Country, ["id", ["name", "label"]], { region_id: regionId });
    if (countRes === 500) {
      res.status(500).send({ message: "Error while getting country names" });
    } else {
      res.status(200).send(countRes);
    }
  })();
}

function submitApplication(req, res) {

  const user_id = req.userdata.user_id;
  let app_id = req.query.app_id;
  const inputs = req.body.inputs;

  // console.log(user_id);
  //console.log(app_id);
  //console.log("INPUTS-", inputs);
  (async () => {

    //Check for Same Project Name
    const projectName = await seq.seqFindOne(Application, ['project_name'], { project_name: req.body.project_name });
    console.log(projectName);
    if (projectName) {
      res.status(422).send({ message: "Application name already exists" });
      return;
    }
    
    // Data To Create or Update in Application Table
    const appData = app_id ? {
      project_name: req.body.project_name,
      application_status_id: 2,
      status: 1,
    } : {
      project_name: req.body.project_name,
      application_status_id: 2,
      user_id: user_id,
      status: 1,
    }

    if (!app_id) {
      //Create App if App not Exist
      const appRes = await seq.seqCreate(Application, appData);
      if (appRes === 500) return res.status(500).send({ message: "Error while creating application" });

      //Got newly Created app ID
      app_id = appRes.id;

    } else {

      // Must be Drafted App
      const appDataRes = await seq.seqFindByPk(Application, app_id, ['application_status_id']);
      // console.log(appDataRes);
      if (appDataRes.application_status_id !== 1) return res.status(500).send({ message: "This Application is already submitted." });

    }

    //Update App Data
    const newUpdate = await seq.seqUpdate(Application, appData, { id: app_id });
    if (newUpdate === 500) return res.status(500).send({ message: "Error while updating application" });

    let isError = false;
    for (let question_id in inputs) {
      console.log("Question_id-", inputs[question_id]);
      const quesRes = await seq.seqCreate(AppQuestion, {
        app_id: app_id,
        question_id: question_id,
      });
      //console.log("QUESRESP-", quesRes);
      if (quesRes === 500) {
        res.status(500).send({ message: "Error while fetching question" });
      }
      const app_question_id = quesRes.id;
      const answer = inputs[question_id];

      console.log("ANSWER-", answer);
      if (Array.isArray(answer)) {
        answer.forEach(async (arrayItem) => {
          console.log("ARRAYITEM-", arrayItem);
          const ansRes = await seq.seqCreate(Answers, {
            answer: arrayItem,
            question_id: question_id,
            app_question_id: app_question_id,
          });
          //console.log("ANS_res-", ansRes);
          if (ansRes === 500) {
            isError = true;
            res
              .status(500)
              .send({ message: "Error while fetching answer type of array" });
          }
        });
      } else if (typeof answer === "string") {
        const ansRes = await seq.seqCreate(Answers, {
          answer: answer,
          question_id: question_id,
          app_question_id: app_question_id,
        });
        if (ansRes === 500) {
          isError = true;
          res
            .status(500)
            .send({ message: "Error while fetching answer type of string" });
        }
      } else if (typeof answer === "object" && answer !== null) {
        //console.log("yes");
        const ansRes = await seq.seqCreate(Answers, {
          answer: JSON.stringify(answer),
          question_id: question_id,
          app_question_id: app_question_id,
        });
        if (ansRes === 500) {
          isError = true;
          res
            .status(500)
            .send({
              message: "Error while fetching answer type of object or null",
            });
        }
      }
    }
    res.status(200).send({ message: "Application successfully submitted", app_id: app_id });
  })();
}

function draftApplication(req, res) {
  const user_id = req.userdata.user_id;
  let app_id = req.query.app_id;
  //console.log(app_id);
  const inputs = req.body.inputs;
  //console.log("INPUTS-", inputs);
  (async () => {

    // Data To Create or Update in Application Table
    const appData = app_id ? {
      project_name: req.body.project_name,
      application_status_id: 1,
      status: 1,
    } : {
      project_name: req.body.project_name,
      application_status_id: 1,
      user_id: user_id,
      status: 1,
    }

    // Create Application If Not Exist
    // Update Application If Exist
    if (!app_id) {
      const appRes = await seq.seqCreate(Application, appData);
      app_id = appRes.id;
      if (appRes === 500) {
        res.status(500).send({ message: "Error while creating application" });
        return;
      }
    } else {

      const newUpdate = await seq.seqUpdate(Application, appData, { id: app_id });
      if (newUpdate === 500) {
        res.status(500).send({ message: "Error while updating application" });
        return;
      }

      // Delete All Existing Application Entry inside App_Question & Answer Table
      const data = await seq.seqFindAll(AppQuestion, ["id"], { app_id: app_id });
      const toBeDltAppQue = [];
      if (data !== 500) {
        data.forEach(obj => {
          toBeDltAppQue.push(obj.id);
        });
      }
      const dltedAppQueRes = await seq.seqDestroy(AppQuestion, { app_id: app_id });
      const dltedAnsRes = await seq.seqDestroy(Answers, { app_question_id: toBeDltAppQue });
      // const dltedAnsRes = await seq.seqDestroy(AppQuestion, { app_question_id: { [Op.eq]: toBeDltAppQue } });

      console.log("toBeDltAppQue: ", toBeDltAppQue);
      console.log("dltedAnsRes: ", dltedAnsRes);
      console.log("dltedAppQue: ", dltedAppQueRes);
    }

    let isError = false;
    for (let question_id in inputs) {
      // console.log("Question_id-", inputs[question_id]);
      const quesRes = await seq.seqCreate(AppQuestion, {
        app_id: app_id,
        question_id: question_id,
      });
      //console.log("QUESRESP-", quesRes);
      if (quesRes === 500) {
        isError = true;
        res.status(500).send({ message: "Error while fetching question" });
        return;
      }

      const app_question_id = quesRes.id;
      const answer = inputs[question_id];

      // console.log("ANSWER-", answer);
      if (Array.isArray(answer)) {
        answer.forEach(async (arrayItem) => {
          console.log("ARRAYITEM-", arrayItem);
          const ansRes = await seq.seqCreate(Answers, {
            answer: arrayItem,
            question_id: question_id,
            app_question_id: app_question_id,
          });
          //console.log("ANS_res-", ansRes);
          if (ansRes === 500) {
            isError = true;
            res.status(500).send({ message: "Error while fetching answer type of array" });
            return;
          }
        });
      } else if (typeof answer === "string") {
        const ansRes = await seq.seqCreate(Answers, {
          answer: answer,
          question_id: question_id,
          app_question_id: app_question_id,
        });
        if (ansRes === 500) {
          isError = true;
          res.status(500).send({ message: "Error while fetching answer type of string" });
          return;
        }
      } else if (typeof answer === "object" && answer !== null) {
        //console.log("yes");
        const ansRes = await seq.seqCreate(Answers, {
          answer: JSON.stringify(answer),
          question_id: question_id,
          app_question_id: app_question_id,
        });
        if (ansRes === 500) {
          isError = true;
          res.status(500).send({ message: "Error while fetching answer type of object or null" });
          return;
        }
      }
    }
    if (isError) return;
    res.status(200).send({ message: "Application successfully drafted", app_id: app_id });
  })();
}

function getDraftedApp(req, res) {
  const appId = req.params.app_id;

  (async () => {
    const AppData = await seq.seqFindByPk(Application, appId, ["id", "project_name", "application_status_id", "updated_at"],
      [
        { model: User, attributes: ['id', 'unique_id', "first_name", "last_name", "email", "contact_no"] },
        { model: ApplicationStatus, attributes: ['id', 'status'] },
      ]
    );
    if (AppData === 500) return res.status(500).send({ message: "Error while getting application" });

    const AppQueRes = await seq.seqFindAll(AppQuestion, ["question_id"], { app_id: appId },
      [
        { model: Question, attributes: ["question_type_id"] },
        { model: Answers, attributes: ["id", "app_question_id", "answer"] },
      ]
    );
    // console.log("AppQueRes: ", AppQueRes);
    const inputs = {};
    AppQueRes.forEach(queAns => {
      let answer;
      // console.log("TYPE: ", queAns.question.question_type_id);
      switch (queAns.question.question_type_id) {
        //Answers in Object Stringified
        case 7: //Picture Choice predefined
        case 14: //Select with TextBox
          answer = queAns.answers.map(ans => JSON.parse(ans.answer))[0];
          break;
        //Answers Single Selected
        case 1:
        case 3:
        case 4:
        case 10:
          answer = queAns.answers.map(ans => ans.answer)[0];
          break;
        //Answers Multiselect
        case 0: //Child Questions
        case 5: //MultiSelect DropDown
        default:
          answer = queAns.answers.map(ans => ans.answer)
      }

      inputs[queAns.question_id] = answer;
    })
    console.log(inputs);
    // res.status(200).send({ Application: AppData, inputs });
    res.status(200).send({ Application: AppData, inputs });

  })();
}
function copyApplication(req,res){
  const appId = req.params.app_id;
  const user_id = req.userdata.user_id;
  //console.log(app_id);
  (async () => {
    const copyAppData = await seq.seqFindByPk(Application, appId, ["id", "project_name", "application_status_id", "updated_at"],
      [
        { model: User, attributes: ['id', 'unique_id', "first_name", "last_name", "email", "contact_no"] },
        { model: ApplicationStatus, attributes: ['id', 'status'] },
      ]
    );
    //console.log("copyApp-", copyAppData.project_name);
    if (copyAppData === 500) return res.status(500).send({ message: "Error while getting application" });
    //console.log(newAppId);
    const copyAppQueRes = await seq.seqFindAll(AppQuestion, ["question_id"], { app_id: appId },
    [
      { model: Question, attributes: ["question_type_id"] },
      { model: Answers, attributes: ["id", "app_question_id", "answer"] },
    ]
    );
    //console.log("AppQueRes: ", copyAppQueRes);
    if (copyAppQueRes === 500) return res.status(500).send({ message: "Error while getting question answers" });
    
    let prjStr = copyAppData.project_name;
    //console.log(prjStr);
    if(prjStr.startsWith('Copy_of')){
      //console.log('yes');
      const countMatch = prjStr.match(/^Copy_of_(.+)_(\d+)$/);
      console.log("countMatch-", countMatch[1]);
      prjStr = countMatch[1];
    } 
      const newAppCount = await seq.seqCount(Application, {project_name:{
        [Op.regexp]: `^Copy_of_(${prjStr})_(\\d+)$`
      }});
      console.log("NewApp", newAppCount);
      
        let newCount = `Copy_of_${prjStr}_${newAppCount + 1}`
        console.log("NewCount", newCount);

      const newData= {
            project_name: newCount,
            application_status_id: 1,
            user_id: user_id,
            status: 1,
         }
      console.log("NewData", newData);  
      const appCreate = await seq.seqCreate(Application, newData);
       if(appCreate === 500) return res.status(500).send({ message: "Error while creating new application"});
  
     // Create application after copying the application
    const newAppId = appCreate.id;

    copyAppQueRes.forEach(async(queAns) => {
     //console.log("QuestionAns", queAns.answers);
     const newAppQues = await seq.seqCreate(AppQuestion, {app_id:newAppId, question_id:queAns.question_id});
     //console.log("newAppQues", newAppQues);
     if (newAppQues === 500) return res.status(500).send({ message: "Error while copying applications" });
     const app_question_id = newAppQues.id;
     const newAnswers = queAns.answers;
     newAnswers.forEach(async(ans)=> {
      //console.log("ANS", ans.id);
      //newResp.push()
      const newAnswerResp = await seq.seqCreate(Answers, 
        {
          question_id:queAns.question_id, 
          app_question_id:app_question_id, 
          answer:ans.answer
        }
        );
        //console.log("NewAns-", newAnswerResp);
        if(newAnswerResp === 500) return res.status(500).send({message:"Error while copying answers"});
      })
    })
    res.status(200).send({message:'Application copied successfully', app_id:newAppId});
  })();
}
module.exports = {
  getAllQuestions,
  getRegionNames,
  getCountryNames,
  submitApplication,
  draftApplication,
  getDraftedApp,
  copyApplication
};
