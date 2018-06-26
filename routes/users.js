var express = require('express');
var router = express.Router();
users = require('../models/user.js');
var bcrypt = require('bcrypt');

/* add admin. */
router.post('/addAdmin', function(req, res, next) {
 
  let password = req.body.password;
  bcrypt.hash(password,5, function(err, bcryptedPassword) {
    let admin = {};
    admin.role = "admin";
    admin.name = req.body.name;
    admin.prenon = req.body.prenon;
    admin.phone = req.body.phone;
    admin.adresse = req.body.adresse;
    admin.email = req.body.email;
    admin.pseudo = req.body.pseudo;
    admin.password = bcryptedPassword;
    users.addUser(admin,function(err,callback){
      console.log(err)
      return res.status(200).json({'user': callback});
    });
  });
  
});

/* add tuteur. */
router.post('/addTuteur', function(req, res, next) {
 
  let password = req.body.password;
  bcrypt.hash(password,5, function(err, bcryptedPassword) {
    let admin = {};
    admin.role = "tuteur";
    admin.name = req.body.name;
    admin.prenon = req.body.prenon;
    admin.phone = req.body.phone;
    admin.adresse = req.body.adresse;
    admin.email = req.body.email;
    admin.pseudo = req.body.pseudo;
    admin.password = bcryptedPassword;
      
    users.addUser(admin,function(err,callback){
      return res.status(200).json({'user': callback});
    });
  });
});

  /* add apprenant. */
router.post('/addApprenant', function(req, res, next) {
 
  let password = req.body.password;
  bcrypt.hash(password,5, function(err, bcryptedPassword) {
    let admin = {};
    admin.role = "apprenant";
    admin.name = req.body.name;
    admin.prenon = req.body.prenon;
    admin.phone = req.body.phone;
    admin.adresse = req.body.adresse;
    admin.email = req.body.email;
    admin.pseudo = req.body.pseudo;
    admin.password = bcryptedPassword;
      
    users.addUser(admin,function(err,callback){
      return res.status(200).json({'user': callback});
    });
  });
  
});

 /* add apprenant. */
 router.post('/login', function(req, res, next) {
 
  let password = req.body.password;
  bcrypt.hash(password,5, function(err, bcryptedPassword) {
    let pseudo = req.body.pseudo;
    let password = bcryptedPassword;
      
    users.login(pseudo,function(err,callback){
      if(admin.length > 0){
        bcrypt.compare(password, admin[0].password, function(err, resbcrypt) {
          if(resbcrypt){
            res.status(200).json({
              'success':true,
              'result':{
              'admin' :callback[0],
              }
              });
          }
          else{
            return res.status (400).json ({'error': 'login inccorect'});
          }
      });
      }
      else{
        return res.status(404).json({ 'error': 'Admin not exist in DB' });
      }
        
    });
  });
  
});

module.exports = router;
