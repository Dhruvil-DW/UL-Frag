const multer = require('multer');
const fs = require('fs');

const DIR = './public/';
!fs.existsSync(DIR) ? fs.mkdirSync(DIR) : console.log('Directory Already exists');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log('request', req);
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    console.log('file', file);
    // const fileName = file.originalname.toLowerCase().split(' ').join('-');
    const fileName = file.originalname;
    cb(null, fileName);
  }
});

// let upload = multer({dest: 'public/'});
let upload = multer({
  storage: storage,
  limits: { fieldNameSize: 255, fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    const match = ["image/png", "image/jpg", "image/jpeg", "application/pdf"];
    if (match.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Invalid File Format (Allowed: .png, .jpg, .jpeg, .pdf)'));      
    }
  }
});

module.exports = upload