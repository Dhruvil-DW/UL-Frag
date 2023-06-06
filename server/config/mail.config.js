require('dotenv').config();
const AWS = require('aws-sdk');

const ses = new AWS.SES({
  apiVersion: '2010-12-01',
  accessKeyId: process.env.SMTP_ACCESS_KEY,
  secretAccessKey: process.env.SMTP_SECRET_KEY,
  region: process.env.SMTP_REGION
});

const sendEmail = (emailList, subject, body) => {
  console.log('email send started');

  const params = {
    Destination: {
      ToAddresses: emailList
    },
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: body
        }
      }      
    },
    ReturnPath: 'no-reply@kypsa.in',
    Source: 'no-reply@kypsa.in',
    ReplyToAddresses: [
      'no-reply@kypsa.in'
    ],
  };

  return new Promise((resolve, reject) => {
    ses.sendEmail(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        resolve(500);
      } else {
        console.log("Email sent.", data);
        resolve(200);
      }
    });
  });
}

module.exports = sendEmail;