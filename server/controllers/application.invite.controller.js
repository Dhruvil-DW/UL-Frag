const db = require("../models/index");
const seq = require("../config/sequelize.config");
const sendEmail = require('../config/mail.config');

const Application = db.Application;
const ApplicationInvite = db.application_invite;
const User = db.User;

function sendInviteApplication(req, res) {

  const app_id = req.params.app_id;
  const emailArr = req.body.newEmail;
  const dltInvite = req.body.deleteInvite;
  const user_id = req.userdata.user_id;
  // console.log({ userId });
  // console.log({ app_id });
  // console.log({ emailArr });

  (async () => {

    //**Delete Already Invited Users */
    const removeInvite = await seq.seqDestroy(ApplicationInvite, { app_id: app_id, user_id: dltInvite.map((obj) => obj.user_id) });
    if (removeInvite === 500) return res.status(500).send({ message: "Error while deleting Invited User" });

    //**Get Application Detais for Sending Emails */
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

    res.status(200).send({ message: "Collabrator invited successfully" });
  })();
}

function getApplicationInvite(req, res) {
  const app_id = req.params.app_id;
  console.log({ app_id });
  (async () => {
    const appInviteRes = await seq.seqFindAll(ApplicationInvite, ["id", "user_id"], { app_id: app_id }, { model: User, attributes: ["id", "email"] });
    res.status(200).send(appInviteRes);
  })();
}

module.exports = {
  sendInviteApplication,
  getApplicationInvite,
}