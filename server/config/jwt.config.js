const jwt = require('jsonwebtoken');
const generateToken = (data) => {
    return new Promise((resolve, reject) => {
      jwt.sign({
        user_id: data.id || 0,
        unique_id: data.unique_id || '',
        role_id: data.role_id || 0,
        email: data.email || '',
        first_name: data.first_name || data.first_name || '',
        last_name: data.last_name || data.last_name || '',
      }, process.env.TOKEN_SECRET_KEY,
        function (err, token) {
          resolve(token);
        });
    });
  }
  
  module.exports = generateToken;