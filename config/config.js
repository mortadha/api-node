var octopush = require('octopush');
var mongoose = require('mongoose');
module.exports = {
    user_login: 'contact@fflok.com',
    api_key: 'VqTtdLKt1rBgpo4WU5FIr18xf9hXpfWV',
    sms_recipients: ['+21626119508'],
    sms_type: octopush.constants.SMS_WORLD,
    sms_sender: 'fflok',
    x_api_key:'InJIznpwpt07sHYeRzqJ5VXDHqmGqXJQ-AwOtaVdWuciqxJocAjW1MhHNktDLPbTj',
    hostMail: '10.32.0.6',
    serviceMail :'SMTP',
    portMail :25,
    seuil : 5,
    keyGoogleMap : "AIzaSyD4LHtqHkSPuSCuaJGQu9_O3Eq8d9lquE0",
    baseUrlGoogleMap : "https://maps.googleapis.com/maps/api/place",
    portSoket : 3000
};
//connect to DB fflok
/*mongoose.connect('mongodb://localhost/fflokv14');
var db = mongoose.connections;*/
mongoose.connect('mongodb://apifrancemortadha:7QS8v0Xd0hEGQ0K8bP9ZIMwOckKISjQKJYBB9VlAGeqGJglXXcpwaXCAgHHrgG8rEADeMrnQGBbNRH9k4IPZtg==@apifrancemortadha.documents.azure.com:10255/?ssl=true);
var db = mongoose.connections;


