const fs = require('fs');

function createFileCopy(currentFileName, newFileName) {
  fs.copyFile(`public/${currentFileName}`, `public/${newFileName}`, (err) => {
    if (err) console.log(err);
  });
}

module.exports = {
  createFileCopy,
}