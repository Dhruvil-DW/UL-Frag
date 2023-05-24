const jwt = require('jsonwebtoken');
const generateToken = (data) => {
    return new Promise((resolve, reject) => {
      jwt.sign({
        userId: data.id || data.userId || 0,
        uniqueId: data.unique_id || data.uniqueId || '',
        email: data.email || '',
        first_name: data.first_name || data.first_name || '',
        last_name: data.last_name || data.last_name || '',
        roleId: data.role_id || data.roleId || 0,
      }, process.env.TOKEN_SECRET_KEY,
        function (err, token) {
          resolve(token);
        });
    });
  }
  
  module.exports = generateToken;