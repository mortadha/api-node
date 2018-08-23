var admin = require("firebase-admin");

var serviceAccount = require("../firebase/fflok-1529511801837-firebase-adminsdk-ve1bg-bcef41c5e6.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fflok-1529511801837.firebaseio.com"
});




module.exports =  {
  sendNotifaction : function sendNotifaction (Message,registrationToken) {
    admin.messaging().sendToDevice(registrationToken,Message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
    return 'test';
  }
}