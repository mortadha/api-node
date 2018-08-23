var jwt = require('jsonwebtoken');
const JWT_SIGN_SECRET = 'ddddizyz';

module.exports = {
    //generate token for Admin
    generateTokenForAdmin: function(adminData) {
        return jwt.sign({
           email: adminData.email
         },
        JWT_SIGN_SECRET
      )
    },
    
    parseAuthorization: function(authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
      },
    getAdmin: function(authorization) {
        var admin ;
        var _id = -1;
        var token = module.exports.parseAuthorization(authorization);
        if(token != null) {
          try {
            var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
            if(jwtToken != null)
            admin=jwtToken.email;
              
          } catch(err) { }
        }
       return admin;
      }



    }


    