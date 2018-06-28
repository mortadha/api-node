var express = require('express');
var router = express.Router();
users = require('../models/user.js');
cours = require('../models/cours.js');
event = require('../models/event.js');
categorie = require('../models/categorie.js');

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
    console.log(password)  ;
    users.login(pseudo,function(err,callback){
      if(callback.length > 0){
        console.log(callback[0].password);
        bcrypt.compare(password, callback[0].password, function(err, resbcrypt) {
          console.log(resbcrypt);
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

 /* add cour. */
 router.post('/addCours', function(req, res, next) {
  let cour = {}
  cour.name = req.body.name;
  cour.description = req.body.description;
  cour.objectifs = req.body.objectifs;
  cour.mots_clé = req.body.mots_clé;
  cour.plan = req.body.plan;
  cour.uploaded_by = req.body.uploaded_by;
  
  
  cours.addCours(cour,function(err,callback){
    return res.status(200).json({'user': callback});
  });
});


 /* add event. */
 router.post('/addEvent', function(req, res, next) {
  let evenement = {}
  evenement.name = req.body.name;
  evenement.description = req.body.description;
  evenement.h_debut = req.body.h_debut;
  evenement.h_fin = req.body.h_fin;
  evenement.uploaded_by = req.body.uploaded_by;
  let cours = {};
  cours.id = req.body.cours;
  evenement.cours = cours;
  evenement.date = new Date(req.body.date);

  event.addEvent(evenement,function(err,callback){
    return res.status(200).json({'event': callback});
  });
});

/* get events. */
router.get('/getEvents', function(req, res, next) {
  event.getEvent( function(err,events){
    if(err){
      throw err;
    }
    return res.status(200).json(events);
  });
});


/* get events. */
router.get('/getMyEvents', function(req, res, next) {
  id = req.body.id;
  event.getMyEvent(id, function(err,events){
    if(err){
      throw err;
    }
    return res.status(200).json(events);
  });
});



 /* add addCategorie. */
 router.post('/addCategorie', function(req, res, next) {
  let cat = {}
  cat.name = req.body.name;
  cat.description = req.body.description;
 

  categorie.addCategorie(cat,function(err,callback){
    return res.status(200).json({'event': callback});
  });
});


/* findCours. */
router.post('/findCours', function(req, res, next) {
 search = req.body.text;
 cours.findCours(search,function(err,callback){
    return res.status(200).json({'event': callback});
  });
});


module.exports = router;
