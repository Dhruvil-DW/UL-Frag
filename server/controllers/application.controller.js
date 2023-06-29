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
const fs = require("fs");

const dayjs = require("dayjs");
const { createFileCopy } = require("../config/file.config");

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

  // console.log("INPUTS: ", req.body.inputs);
  const user_id = req.userdata.user_id;
  console.log('user id-', user_id);
  let app_id = req.query.app_id;
  console.log({ app_id });
  const data = req.body;
  const inputs = JSON.parse(data.inputs);
  const que_inputs = inputs.inputs;

  (async () => {
    const projectName = await seq.seqFindOne(Application, ['project_name'], { project_name: inputs.project_name });
    console.log(projectName);
    if (projectName && !app_id) {
      res.status(422).send({ message: "Application name already exists" });
      return;
    }

    // Data To Create or Update in Application Table
    const appData = app_id ? {
      project_name: inputs.project_name,
      application_status_id: 2,
      status: 1,
    } : {
      project_name: inputs.project_name,
      application_status_id: 2,
      user_id: user_id,
      status: 1,
    }

    if (!app_id) {
      //Create App if App not Exist
      console.log("Creating Application")
      const appRes = await seq.seqCreate(Application, appData);
      if (appRes === 500) return res.status(500).send({ message: "Error while creating application" });

      //Got newly Created app ID
      app_id = appRes.id;

    } else {

      // Must be Drafted App
      const appDataRes = await seq.seqFindByPk(Application, app_id, ['application_status_id']);
      // console.log(appDataRes);
      if (appDataRes.application_status_id !== 1) return res.status(500).send({ message: "This Application is already submitted." });

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

      // console.log("toBeDltAppQue: ", toBeDltAppQue);
      // console.log("dltedAnsRes: ", dltedAnsRes);
      // console.log("dltedAppQue: ", dltedAppQueRes);

    }

    //Update App Data
    const newUpdate = await seq.seqUpdate(Application, appData, { id: app_id });
    if (newUpdate === 500) return res.status(500).send({ message: "Error while updating application" });

    let isError = false;
    for (let question_id in que_inputs) {
      // console.log("Question_id-", que_inputs[question_id]);
      const quesRes = await seq.seqCreate(AppQuestion, {
        app_id: app_id,
        question_id: question_id,
      });
      //console.log("QUESRESP-", quesRes);
      if (quesRes === 500) {
        res.status(500).send({ message: "Error while fetching question" });
      }
      const app_question_id = quesRes.id;
      const answer = que_inputs[question_id];

      console.log("ANSWER-", answer);
      if (Array.isArray(answer)) {
        answer.forEach(async (arrayItem) => {
          // console.log("ARRAYITEM-", arrayItem);
          const ansRes = await seq.seqCreate(Answers, {
            answer: typeof arrayItem === "object" ? JSON.stringify(arrayItem) : arrayItem,
            question_id: question_id,
            app_question_id: app_question_id
          });
          //console.log("ANS_res-", ansRes);
          if (ansRes === 500) {
            isError = true;
            return res.status(500).send({ message: "Error while fetching answer type of array" });
          }
        });
      } else if (typeof answer === "string") {
        const ansRes = await seq.seqCreate(Answers, { answer: answer, question_id: question_id, app_question_id: app_question_id });
        if (ansRes === 500) {
          isError = true;
          return res.status(500).send({ message: "Error while fetching answer type of string" });
        }
      } else if (typeof answer === "object" && answer !== null) {
        //console.log("yes");
        const ansRes = await seq.seqCreate(Answers, { answer: JSON.stringify(answer), question_id: question_id, app_question_id: app_question_id });
        if (ansRes === 500) {
          isError = true;
          return res.status(500).send({ message: "Error while fetching answer type of object or null" });
        }
      }
    }

    await seq.seqUpdate(Application, { last_edit_by: null, last_edit_time: null }, { id: app_id });
    res.status(200).send({ message: "Application successfully submitted", app_id: app_id });
  })();
}

function draftApplication(req, res) {
  const user_id = req.userdata.user_id;
  let app_id = req.query.app_id;
  //console.log(app_id);
  const data = req.body;
  const inputs = JSON.parse(data.inputs);
  const que_inputs = inputs.inputs;
  const removeFiles = JSON.parse(data.removeFiles);

  (async () => {
    const projectName = await seq.seqFindOne(Application, ['project_name'], { project_name: inputs.project_name });
    console.log(projectName);
    if (projectName && !app_id) {
      res.status(422).send({ message: "Application name already exists" });
      return;
    }
    // Data To Create or Update in Application Table
    const appData = app_id ? {
      project_name: inputs.project_name,
      application_status_id: 1,
      status: 1,
    } : {
      project_name: inputs.project_name,
      application_status_id: 1,
      user_id: user_id,
      status: 1,
    };

    // Create Application If Not Exist
    // Update Application If Exist
    let removeFileImageRes;
    deleteFiles(removeFiles, (err) => {
      if (err) {
        removeFileImageRes = 500;
        console.log(err);
      } else {
        removeFileImageRes = 200;
        console.log('all files removed');
      }
    });

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

      // console.log("toBeDltAppQue: ", toBeDltAppQue);
      // console.log("dltedAnsRes: ", dltedAnsRes);
      // console.log("dltedAppQue: ", dltedAppQueRes);
    }

    let isError = false;
    for (let question_id in que_inputs) {
      // console.log("Question_id-", que_inputs[question_id]);
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
      const answer = que_inputs[question_id];

      // console.log("ANSWER-", answer);
      if (Array.isArray(answer)) {
        answer.forEach(async (arrayItem) => {
          const ansRes = await seq.seqCreate(Answers, {
            answer: typeof arrayItem === "object" ? JSON.stringify(arrayItem) : arrayItem,
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
    //**Update Appp so other User can Edit Application */
    await seq.seqUpdate(Application, { last_edit_by: null, last_edit_time: null }, { id: app_id });
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
        case 8: //Multi-Select Picture Choice
          if (queAns.question_id === 23) { //With TextBox
            answer = queAns.answers.map(ans => JSON.parse(ans.answer))[0];
          } else {
            answer = queAns.answers.map(ans => ans.answer);
          }
          break;
        //Answers Single Selected
        case 1:
        case 3:
        case 4:
        case 10:
          if(queAns.question_id === 24) {
            answer = JSON.parse(queAns.answers.map(ans => ans.answer)[0]);
          } else {
            answer = queAns.answers.map(ans => ans.answer)[0];
          }
          break;
        case 9: // Add Multiple Section
          answer = queAns.answers.map(ans => JSON.parse(ans.answer));
          break;
        case 13: // Textarea with File Upload
          answer = queAns.answers.map(ans => JSON.parse(ans.answer))[0];
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

function copyApplication(req, res) {
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
    if (prjStr.startsWith('Copy_of')) {
      //console.log('yes');
      const countMatch = prjStr.match(/^Copy_of_(.+)_(\d+)$/);
      console.log("countMatch-", countMatch[1]);
      prjStr = countMatch[1];
    }
    const newAppCount = await seq.seqCount(Application, {
      project_name: {
        [Op.regexp]: `^Copy_of_(${prjStr})_(\\d+)$`
      }
    });

    let newCount = `Copy_of_${prjStr}_${newAppCount + 1}`
    console.log("NewCount", newCount);

    const newData = {
      project_name: newCount,
      application_status_id: 1,
      user_id: user_id,
      status: 1,
    }
    console.log("NewData", newData);
    const appCreate = await seq.seqCreate(Application, newData);
    if (appCreate === 500) return res.status(500).send({ message: "Error while creating new application" });

    // Create application after copying the application
    const newAppId = appCreate.id;

    copyAppQueRes.forEach(async (queAns) => {
      console.log("QuestionAns", queAns.question);
      const newAppQues = await seq.seqCreate(AppQuestion, { app_id: newAppId, question_id: queAns.question_id });
      //console.log("newAppQues", newAppQues);
      if (newAppQues === 500) return res.status(500).send({ message: "Error while copying applications" });
      const app_question_id = newAppQues.id;
      const newAnswers = queAns.answers;
      newAnswers.forEach(async (ans) => {
        //console.log("ANS", ans.id);
        //newResp.push();
        let answerStr = ans.answer;
        if (queAns.question_id === 1) {
          //**Project Name Changes */
          const answerObj = JSON.parse(answerStr);
          answerObj.projectName = newCount;
          answerStr = JSON.stringify(answerObj);
        }

        if (queAns.question.question_type_id === 9) {
          //**Question for Variation and Upload Image */
          const answerObj = JSON.parse(answerStr);
          answerObj.files = answerObj.files.map((imgName) => {
            const renameFile = `${newAppId}_${imgName}`;
            createFileCopy(imgName, renameFile);
            return renameFile;
          });
          answerStr = JSON.stringify(answerObj);
        } else if (queAns.question.question_type_id === 13) {
          //**Question for TextBox and Upload Image  */
          const answerObj = JSON.parse(answerStr);
          answerObj.files = answerObj.files.map((imgName) => {
            const renameFile = `${newAppId}_${imgName}`;
            createFileCopy(imgName, renameFile);
            return renameFile;
          });
          answerStr = JSON.stringify(answerObj);
        }

        const newAnswerResp = await seq.seqCreate(Answers,
          {
            question_id: queAns.question_id,
            app_question_id: app_question_id,
            answer: answerStr
          }
        );
        //console.log("NewAns-", newAnswerResp);
        if (newAnswerResp === 500) return res.status(500).send({ message: "Error while copying answers" });
      })
    })
    res.status(200).send({ message: 'Application copied successfully', app_id: newAppId });
  })();
}

function editApplication(req, res) {
  const app_id = req.params.app_id;
  const user_id = req.userdata.user_id;
  const currentTime = dayjs();

  // console.log({ app_id, user_id });

  (async () => {
    const appRes = await seq.seqFindByPk(Application, app_id, ["id", "last_edit_by", "last_edit_time"]);
    if (appRes === 500) return res.status(500).send({ message: "Error while getting Application data" });

    const last_edit_by = appRes.last_edit_by;
    const last_edit_time = appRes.last_edit_time;
    console.log({ last_edit_by, last_edit_time });

    if (last_edit_by && last_edit_time) {
      //** Last Edit By & Last Edit Time Exist;
      if (last_edit_by !== user_id) {
        //** Request user is not Last Editor
        const diff = currentTime.diff(dayjs(appRes.last_edit_time), "minute");
        console.log("Minute: ", diff);
        if (diff < 15) {
          //** Editing started withing 15 minutes
          res.status(200).send({ canEdit: false, message: "Editing is in-progress by other user" });
          return;
        }
      }
    }
    //** Update App with new User and Time
    const updateApp = await seq.seqUpdate(Application, { last_edit_by: user_id, last_edit_time: new Date() }, { id: app_id });
    if (updateApp === 500) return res.status(500).send({ message: "Error while updating Application data" });
    res.status(200).send({ canEdit: true });
  })();
}


const deleteFiles = (files, callback) => {
  var i = files.length;
  console.log('remove image', typeof (files));
  files.map((files) => {
    fs.unlink('./public/' + files, function (err) {
      i--;
      if (err) {
        callback(err);
        return;
      } else if (i <= 0) {
        callback(null);
      }
    });
  });
}

function getImage(req, res) {
  const image_name = req.params.image_name;
  const options = {
    root: (__dirname, './public/'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }
  const filepath = "./" + image_name;
  if (fs.existsSync('./public/' + filepath)) {
    // res.set({ 'Content-Type': 'image/jpeg' });
    res.status(200).sendFile(filepath, options);
  } else {
    res.status(404).send({ message: "Not found" });
  }
}

module.exports = {
  getAllQuestions,
  getRegionNames,
  getCountryNames,
  submitApplication,
  draftApplication,
  getDraftedApp,
  copyApplication,
  editApplication,
  getImage,
};