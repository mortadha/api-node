var jwt = require('jsonwebtoken');
const JWT_SIGN_SECRET = 'ddddizyz';

module.exports = {
    //generate token for user
    generateTokenForUser: function(userData) {
        return jwt.sign({
            login: userData.login
         },
        JWT_SIGN_SECRET
      )
    },
    
    parseAuthorization: function(authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
      },
    getUser: function(authorization) {
        var user ;
        var _id = -1;
        var token = module.exports.parseAuthorization(authorization);
        if(token != null) {
          try {
            var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
            if(jwtToken != null)
            user=jwtToken.login;
              
          } catch(err) { }
        }
       return user;
      }
    }


    