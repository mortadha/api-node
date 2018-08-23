var nodemailer = require('nodemailer');
var config = require('../config/config.js');

var transporter = nodemailer.createTransport({
  service: config.serviceMail,
  host: config.hostMail,
    port: config.portMail
});

var mailOptions = {
  from: 'fflok@orevonlabs.fr',
  subject: 'Invitation from fflok',
};


module.exports =  {send : function(option) {
    mailOptions.to = option.to ;
    mailOptions.text = option.text ;
    transporter.sendMail(mailOptions, function(error, info){
      console.log("err mail :");
        if (error) {
          console.log("err mail :");
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
}