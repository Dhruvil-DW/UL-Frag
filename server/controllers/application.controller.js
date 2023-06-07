const db = require("../models/index");
const User = db.User;
const Question = db.question;
const Category = db.category;
const Country = db.country;
const Application = db.Application;
const Answers = db.answers;
const AppQuestion = db.app_question;
const ApplicationStatus = db.application_status;
const seq = require("../config/sequelize.config");
const { Op } = require("sequelize");

function getAllQuestions(req, res) {
  // const category_id = parseInt(req.query.category_id);
  // console.log(category_id);
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
      //childData.push(item);
    });
    //console.log({childData});
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
    console.log("GETRESP-", getRes);
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

function getCountryNames(req, res) {
  const searchText = req.query.search;
  const whereCond = searchText
    ? {
      [Op.or]: [{ name: { [Op.like]: "%" + searchText + "%" } }],
    }
    : {};
  (async () => {
    const countRes = await seq.seqFindAll(Country, ["id", "name"], whereCond);
    if (countRes === 500) {
      res.status(500).send({ message: "Error while getting country names" });
    } else {
      res.status(200).send(countRes);
    }
  })();
}

// function getNestedQuestion(req, res) {
//   const parent_id = req.params.parent_id;
//   console.log(parent_id);
//   (async () => {
//     const quesRes = await seq.seqFindAll(
//       Question,
//       [
//         "id",
//         "category_id",
//         "question",
//         "question_type_id",
//         "question_opt",
//         "status",
//       ],
//       { parent_id: parent_id },
//       { model: Category, attributes: ["id", "name"] }
//     );
//     if (quesRes === 500) {
//       res.status(500).send({ message: "Error while getting nested questions" });
//     } else {
//       res.status(200).send(quesRes);
//     }
//   })();
// }
function submitApplication(req, res) {
  //console.log(req.body);
  const user_id = req.userdata.user_id;
  console.log(user_id);
  let app_id = req.query.app_id;
  //console.log(app_id);
  const inputs = req.body.inputs;
  //console.log("INPUTS-", inputs);
  (async () => {
    const projectName = await seq.seqFindOne(Application, ['project_name'], { project_name: req.body.project_name });
    console.log(projectName);
    if (projectName) {
      res.status(422).send({ message: "Application name already exists" });
      return;
    }
    const appData = {
      project_name: req.body.project_name,
      application_status_id: 2,
      user_id: user_id,
      status: 1,
    };
    if (!app_id) {
      const appRes = await seq.seqCreate(Application, appData);
      app_id = appRes.id;
      if (appRes === 500) {
        res.status(500).send({ message: "Error while creating application" });
        return;
      }
    }
    const newUpdate = await seq.seqUpdate(Application, appData, { id: app_id });
    if (newUpdate === 500) {
      res.status(500).send({ message: "Error while updating application" });
      return;
    }
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
    const appData = {
      project_name: req.body.project_name,
      application_status_id: 1,
      user_id: user_id,
      status: 1,
    };

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
        res.status(500).send({ message: "Error while fetching question" });
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
module.exports = {
  getAllQuestions,
  getCountryNames,
  //getNestedQuestion,
  submitApplication,
  draftApplication,
  getDraftedApp,
};
