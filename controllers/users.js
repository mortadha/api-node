var express = require('express');
var bodyParser = require('body-parser');
users = require('../models/user.js');
var jwtUtils= require('../services/jwt.utils');
var fireBase = require('../services/fireBase');
var sendMail = require('../services/mail');
var i18n = require('../services/locale.json');
var octopush = require('octopush');
var config = require('../config/config.js');
var multer  = require('multer');
var geodist = require('geodist');
const NodeCache = require( "node-cache" );
var forEach = require('async-foreach').forEach;
var dateFormat = require('dateformat');
const myCache = new NodeCache( { stdTTL: 9999999999999, checkperiod: 120 } );
obj = { my: "distance", variable: 30 };
myCache.set( "distance", obj);



//verification email
const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//config multer for upload video
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
  }
})
const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'video/x-flv' || file.mimetype === 'video/mp4' || file.mimetype === 'application/x-mpegURL' || file.mimetype === 'video/MP2T' || file.mimetype === 'video/3gpp'
  || file.mimetype === 'video/quicktime' || file.mimetype === 'video/x-msvideo' || file.mimetype === 'video/x-ms-wmv'
   ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
 };
var upload = multer({ storage: storage })


module.exports = {
/**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       phone:
 *         type: string
 *       name:
 *         type: string
 *       prenon:
 *         type: string
 *       likers:
 *         type: user
 *       code:
 *         type: string
 *       active:
 *         type: boolean
 *       path_img:
 *         type: string
 *       adresse:
 *         type: string
 *       age:
 *         type: string
 *       ville:
 *         type: string
 *       statu:
 *         type: boolean
 *       latitude:
 *         type: string
 *       longitude:
 *         type: string
 *       profil_mode:
 *         type: string
 *       registrationToken:
 *         type: string
*/
/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of puppies
 *         schema:
 *           $ref: '#/definitions/User'
 */
getAllUsers: function (req, res, next) {
 
  // Getting auth header
  var headerAuth  = req.headers['authorization'];
  
  var userId      = jwtUtils.getUser(headerAuth);
  if (userId){
    users.getUsers( function(err,users){
      if(err){
        throw err;
      }
      return res.status(200).json(users);
    });
    }else{
      return res.status(401).json({'error': 'wrong token'});
  }
},
/**
 * @swagger
 * /users/step1/addUser:
 *   post:
 *     tags:
 *       - Users
 *     description: Creates a new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: user object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: Successfully 
 */
step1:function(req, res, next) {
  var user = {};
  user.badge = [];
  user.phone = req.body.phone;
 if(user.phone && user.phone!=""){
    
    //Generate a rondom code 
    var code = Math.floor(Math.random() * 8999) + 1000 ;

    //Send code via sms to user fflok 
    var sms = new octopush.SMS(config.user_login, config.api_key);
    sms.set_sms_text(i18n.Sms_validation.fr + code);
    sms.set_sms_recipients([user.phone]);
    sms.set_sms_type(config.sms_type);
    sms.set_sms_sender(config.sms_sender);
    sms.set_sms_request_id(sms.uniqid());
    sms.send(function(e, r){
      console.log(e);
      console.log(r);
    });
    user.code = code;

    //check exist phone
    users.checkCodeSms(user.phone, function(err, userfflok){
      if(err){
        throw err;
      }
      if(userfflok.length > 0){
        users.updateCodeUser(user.phone,code, function(err, user){
          if(err){
            err = err.errors
            res.status(500).json({
              'success':true,
              'err':err
            });
            }
          res.status(200).json({
            'success':true,
            'result':{
              'new':false,
              'token': jwtUtils.generateTokenForUser(user)
            }
          });
        });
      }
      else{
          //add user fflok to db
          var data = {
            name: i18n.New_recruit.fr,
            subtitle: '',
          //  date: Date.now(),
        };
       user.badge.push(data);
        users.addUser(user, function(err, user){
            if(err){
              err = err.errors
              res.status(500).json({
                err
              });
              }
            res.status(200).json({
              'success':true,
              'result':{
                'new':true,
                'token': jwtUtils.generateTokenForUser(user)
              }
              });
          });
      }
      
    });
  }else{
    res.status(500).json('required phone number');
  }
  
},

/**
 * @swagger
 * /users/step2/addUser:
 *   put:
 *     tags:
 *       - Users
 *     description: check code and update registrationToken
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: user object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: Successfully updated
 */
step2: function(req, res, next) {
 
 // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUser(headerAuth);
    if (userId){
      var code = req.body.code;
      var registrationToken = req.body.registrationToken;
      var latitude = req.body.latitude;
      var longitude = req.body.longitude;

      if (registrationToken == null ) {
        return res.status (400).json ({'error': 'missing registrationToken!'});
      }
      if ( latitude==null ) {
        return res.status (400).json ({'error': 'missing latitude !'});
      }
      if ( longitude==null ) {
        return res.status (400).json ({'error': 'missing longitude !'});
      }
      if ( code==null) {
        return res.status (400).json ({'error': 'missing code !'});
      }
      if(code != undefined && code !=""){
        var id = userId;
        users.checkCodeSmsPhone(id,code,registrationToken,latitude,longitude, function(err, user){
          if(err){
            throw err;
          }
          if(user){
           return res.status(200).json({
            'success':true,
            'result':{
              'user':user
              }
            }
           );
          }
          else{
            return res.status(401).json({ 'error': 'incorrect code' });
          }
          
        });
      }else{
        return res.status(401).json({ 'error': 'incorrect code' });
      }
    }
    else{
      return res.status(401).json({ 'error': 'wrong token' });
    }
},

/**
 * @swagger
 * /users/step3/addUser:
 *   put:
 *     tags:
 *       - Users
 *     description: update prenom
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: user object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: Successfully updated
 */
step3: function(req, res, next) {
  
  // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUser(headerAuth);
    var prenom = req.body.prenom;

    if (prenom == null   ) {
      return res.status (400).json ({'error': 'missing parameters!'});
    }
    
    if (userId){
      var id = userId;
       prenom = {text:req.body.prenom,visible:true};
      users.updateNameUser(id,prenom, function(err, user){
    if(err){
      throw err;
    }
        res.status(200).json({
          'success':true});
      });
    }
    else{
      return res.status(401).json({ 'error': 'wrong token' });
    }
},


//exist user 
existUser:'/exist-user/:phone', function(req, res, next) {
  if(req.headers['x-api-key'] != config.x_api_key){
    return res.status(401).json({ 'error': 'x_api_key incorrect' });
  }
  return null;
},

/**
 * @swagger
 * /users/step4/addUser:
 *   put:
 *     tags:
 *       - Users
 *     description: update user picture
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: user object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: Successfully updated
 */
step4:function(req, res) {
  
  // Getting auth header
  var headerAuth  = req.headers['authorization'];
  var userId      = jwtUtils.getUser(headerAuth);
  let idImg = req.headers['authorization'].substr(40, 30);
  if (userId){
    if( req.file == undefined ){
      return res.status(500).json({ 'error': 'file type invalid ' });
    }
    var id = userId;
    var video_name = idImg+"-"+req.file.fieldname + '-' + dateFormat(new Date(), "yyyy-mm-dd") + '-' + req.file.originalname;
    var video = video_name,visible;
    users.updateVideoUser(id,video, function(err, user){
  if(err){
    throw err;
  }
      res.json({
        'success':true,
        'path':user.path_video});
    });
  }
  else{
    return res.status(401).json({ 'error': 'wrong token' });
  }
},
step5:function(req, res) {
  
  // Getting auth header
  var headerAuth  = req.headers['authorization'];
  var userId      = jwtUtils.getUser(headerAuth);
  let idImg = req.headers['authorization'].substr(40, 30);
  if (userId){
    if( req.file == undefined ){
      return res.status(500).json({ 'error': 'file type invalid ' });
    }
    var id = userId;
    var video_name = idImg+"-"+req.file.fieldname + '-' + dateFormat(new Date(), "yyyy-mm-dd") + '-' + req.file.originalname;
    var video = video_name;
    users.updateImageUser(id,video, function(err, user){
  if(err){
    throw err;
  }
      res.json({
        'success':true,
        'path':user.path_img});
    });
  }
  else{
    return res.status(401).json({ 'error': 'wrong token' });
  }
},
updateposition:function(req, res) {
  
  // Getting auth header
  var headerAuth  = req.headers['authorization'];
  var userId      = jwtUtils.getUser(headerAuth);
  
  if (userId){
    var latitude  = req.body.latitude;
    var longitude = req.body.longitude;
    if ( latitude==null || longitude==null) {
      return res.status (400).json ({'error': 'missing parameters!'});
    }
    users.updatePosition(userId,latitude,longitude, function(err, user){
  if(err){
    throw err;
  }
      res.json({
        'success':true});
    });
  }
  else{
    return res.status(401).json({ 'error': 'wrong token' });
  }
},
updatepositionSendInvitaion:function(req, res) {
  
  // Getting auth header
  var headerAuth  = req.headers['authorization'];
  var userId      = jwtUtils.getUser(headerAuth);
  distance = myCache.get( "distance" );
   
  if (userId){
    var latitude  = req.body.latitude;
    var longitude = req.body.longitude;
    if ( latitude==null || longitude==null) {
      return res.status (400).json ({'error': 'missing parameters!'});
    }
    let myProfil ;
    let lastLongiude ;
    let lastLatitude ;

    users.getMyProfil(userId,function(err, myProfil){
      if(myProfil){
        lastLatitude = myProfil.latitude;
        lastLongiude = myProfil.longitude;
        users.updatePosition(userId,latitude,longitude,distance.variable, function(err, user){
          if(err){
            throw err;
          }  
          dist = geodist({lastLatitude, lastLongiude}, {latitude:latitude,longitude:longitude},{exact: true,unit:'km'});
            if(dist > distance.variable){
                 user.likers.forEach(function(friend) {
                  if( friend.id ){
                    //send notification
                  }
                });
              }
         
              res.json({
                'success':true,
                'inviation':user.likers});
            });
       }
      else{
        return res.status(401).json({ 'error': 'user not found' });
      }
    });
  
  }
  else{
    return res.status(401).json({ 'error': 'wrong token' });
  }
},
updateStatu:function(req, res) {
  
  // Getting auth header
  var headerAuth  = req.headers['authorization'];
  var userId      = jwtUtils.getUser(headerAuth);
  if (userId){
    var statu  = req.body.statu;
    users.updateStatu(userId,statu, function(err, user){
  if(err){
    throw err;
  }
      res.json({
        'success':true});
    });
  }
  else{
    return res.status(401).json({ 'error': 'wrong token' });
  }
},
getMyProfil:function(req, res) {
  
  // Getting auth header
  var headerAuth  = req.headers['authorization'];
  var userId      = jwtUtils.getUser(headerAuth);
  if (userId){
    users.getMyProfil(userId, function(err, user){
  if(err){
    throw err;
  }
      res.json({
        'success':true,
        'user' : user
      });
    });
  }
  else{
    return res.status(401).json({ 'error': 'wrong token' });
  }
},
/**
 * @swagger
 * /users/add-friend:
 *   post:
 *     tags:
 *       - Users
 *     description: add new  to new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: user object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: Successfully 
 */
addFriend: function(req, res, next) {
 
  // Getting auth header
  var headerAuth  = req.headers['authorization'];
  var userId      = jwtUtils.getUser(headerAuth);
  if (userId){
  var myphone = userId;
  var phone = req.body.phone;
  var email = req.body.email;
  var name  = req.body.name;
  var source= req.body.source;
  users.checkCodeSms(phone, function(err, userfflok){
    if(err){
      throw err;
    }
    if(userfflok.length > 0){
      users.friendOrNo(myphone,userfflok[0].id, function(err, friend){
        if(friend.length == 0){
          users.addNewFriend(myphone,userfflok[0].id, function(err, user){
            if(err){
              throw err;
            }
            res.status(200).json({
              'success':true,
              'user_fflok':true
            });
          });
        }else{
          res.status(200).json({
            'success':true,
            'user_fflok':'already friend'
          });
        }
    });
    }
    else{
      if(phone != undefined){
        var u = req.body;
        var friend = {};
        friend.phone = phone;
        users.addUser(friend, function(err, friend){
          users.addNewFriend(userId,friend.id, function(err, user){ });
        });
        var sms = new octopush.SMS(config.user_login, config.api_key);
        sms.set_sms_text(req.body.name + i18n.Sms_Invitation.fr);
        sms.set_sms_recipients([phone]);
        sms.set_sms_type(config.sms_type);
        sms.set_sms_sender(config.sms_sender);
        sms.set_sms_request_id(sms.uniqid());
        sms.send(function(e, r){
          console.log(e);
          console.log(r);
        });
      }
      if (EMAIL_REGEX.test(email)) {
        var option= {
          to:email,
          text:req.body.name + i18n.Sms_Invitation.fr
        };
        sendMail.send(option);
        res.status(200).json({
          'success':false,
          'user_fflok':false,
          'invitation':true
        });
      }else{ 
        res.status(400).json({
          'success':false,
          'user_fflok':false,
          'invitation':false
          
        });
      }
    }
  });
}
  else{
    return res.status(401).json({ 'error': 'wrong token' });
  }
},
checkUsers: function(req, res, next) {
 
  // Getting auth header
  let headerAuth  = req.headers['authorization'];
  let userId      = jwtUtils.getUser(headerAuth);
  if (userId){
  let listeUSers = req.body.listeUSers;
  let usersFriend = [];
  if ( listeUSers==null) {
    return res.status (400).json ({'error': 'missing parameters!'});
  }
  let lengthUsers = listeUSers.length;
  let compt = 0;
  listeUSers.forEach(function(user){
    users.checkCodeSms(user, function(err, userfflok){
      if(err){
        throw err;
      }
      if(userfflok.length == 0){
        compt ++;
        let noUser ={};
        noUser.fflok = false;
        noUser.phone = user;
        usersFriend.push(noUser);
        if(compt == lengthUsers){
          res.status(200).json({
            'success':true,
            'listeUsers':usersFriend
          })
        }
      }
     else{

      users.friendOrNo(userId,userfflok[0].id, function(err, friend){
        if(friend.length == 0){
          compt ++;
          let myFriend ={};
          myFriend.fflok = true;
          myFriend.phone = user;
          myFriend.friend = false;
          myFriend.path_img =userfflok[0].path_img;
          myFriend.badge = "https://dev.fflok.orevonlabs.fr/public/badges/Nouvelle-recrue.png";
          usersFriend.push(myFriend);
          if(compt == lengthUsers){
            res.status(200).json({
              'success':true,
              'listeUsers':usersFriend
            })
          }
        }else{
          compt ++;
          let myFriend ={};
          myFriend.fflok = true;
          myFriend.phone = user;
          myFriend.friend = true;
          myFriend.path_img =userfflok[0].path_img;
          myFriend.badge = "https://dev.fflok.orevonlabs.fr/public/badges/Nouvelle-recrue.png";
          usersFriend.push(myFriend);
          if(compt == lengthUsers){
            res.status(200).json({
              'success':true,
              'listeUsers':usersFriend
            })
          }
        }
        
      })
    }
   })
  }
  );
}
  else{
    return res.status(401).json({ 'error': 'wrong token' });
  }
},
/**
 * @swagger
 * /users/get-friends:
 *   get:
 *     tags:
 *       - Users
 *     description: Get friends of users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of puppies
 *         schema:
 *           $ref: '#/definitions/User'
 */
getFriends: function(req, res, next) {
  
   // Getting auth header
   var headerAuth  = req.headers['authorization'];
   var phone      = jwtUtils.getUser(headerAuth);
  if (phone){
      users.GetFriends( phone, function(err,users){
        if(err){
          throw err;
        }
        
      return res.status(200).json({
          'success':true,
          'number likers':users.likers.length,
          'likres ':users.likers
        });
    });
  }else{
    return res.status(401).json({ 'error': 'wrong token' });
  }
  },
  getProximiteNoFriends : function(req, res, next) {
    // Getting auth header
   var headerAuth  = req.headers['authorization'];
   var phone       = jwtUtils.getUser(headerAuth);
   var latitude    = req.body.latitude;
   var longitude   = req.body.longitude;
   var fflok       = req.body.fflok;
  

  if (phone){
    let listePhone = [];
    listePhone.push(phone);
    listePhone.push("+21612317897479");
    users.GetProximiteFriend(listePhone, 36.806494799999997 , 10.181531600000007 , function(err,users){
      return res.status(200).json({
        'success':true,
        'number users':users.length,
        'users ':users
      });
    });
    }else{
    return res.status(401).json({ 'error': 'wrong token' });
    }
  }
  ,
  getProximiteFriends : function(req, res, next) {
    // Getting auth header
   var headerAuth  = req.headers['authorization'];
   var phone       = jwtUtils.getUser(headerAuth);
   var latitude    = req.body.latitude;
   var longitude   = req.body.longitude;
   var fflok       = req.body.fflok;
   var start = fflok * 15 - 15;
   var end   = start + 15;
    //test sur les parametres
    if (fflok == null   || latitude==null || longitude==null) {
      return res.status (400).json ({'error': 'missing parameters!'});
    }
    if (phone){
      var friends = [];
      var phones  = [];
      var friendsOfFriends = [];
      phones.push(phone);
      //get liste friends
      users.GetProximiteFriend( phone,latitude,longitude, function(err,myfriends){
        if(err){
          throw err;
        }
        //filter liste friends 
            myfriends.likers.forEach(function(friend) {
            if(friend.id) {
              phones.push(friend.id.phone);
              let user = {};
              user.friend = true;
              user.name = friend.id.name;
              user.score = friend.score;
              user.phone = friend.id.phone;
              user.id    = friend.id.id;
              user.path_img = friend.id.path_img;
              friends.push(user);
           
            friend.id.likers.forEach(function(idFriend) {
              friendsOfFriends.indexOf(idFriend.id) === -1 ? friendsOfFriends.push(idFriend.id) : console.log("This item already exists");
            });
          }
        });
        if( friends.length < 30 ){
          users.GetProximitenoFriend(phones,friendsOfFriends, latitude , longitude , function(err,users){
           users.forEach(function(friend) {
            let user = {};
            user.friend = false;
            user.name = friend.name;
            user.phone = friend.phone;
            user.id    = friend.id;
            user.path_img = friend.path_img;
            friends.push(user);
           });
           friends.sort(function(a, b){return b.score - a.score});
           return res.status(200).json({
            'success':true,
            'number friends':friends.length,
            'friends ' : friends.slice(start,end)
          });
           });
        }else {
          return res.status(200).json({
            'success':true,
            'number friends':friends.length,
            'friends ' : friends.slice(start,end)
          });
        }
     });
  }else{
    return res.status(401).json({ 'error': 'wrong token' });
  }
  },
  addFavoritePlace : function(req, res, next) {
     // Getting auth header
      var headerAuth  = req.headers['authorization'];
      var phone       = jwtUtils.getUser(headerAuth);

      idPlace         = req.body.idPlace;
      //test sur les parametres
      if (idPlace == null) {
        return res.status (400).json ({'error': 'missing parameters!'});
      }
      if (phone){
        users.addFavoritePlace(phone,idPlace , function(err,place){
          if(err){
            throw err;
          }
          return res.status(200).json({ 'success': 'true'});
        });
      }else{
        return res.status(401).json({ 'error': 'wrong token' });
      }
  },
  checkFavoritePlace: function(req, res, next) {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var phone       = jwtUtils.getUser(headerAuth);

    idPlace         = req.body.idPlace;
    //test sur les parametres
    if (idPlace == null) {
      return res.status (400).json ({'error': 'missing parameters!'});
    }
    if (phone){
      users.checkFavoritePlace(phone,idPlace , function(err,place){
        if(err){
          return res.status(200).json({ 'favorite': 'false'});
        }
         return res.status(200).json({ 'favorite': 'true'});
       });

    }else{
      return res.status(401).json({ 'error': 'wrong token' });
    }
  },
  getchancefflok : function(req, res, next) {
    // Getting auth header
   var headerAuth  = req.headers['authorization'];
   var phone      = jwtUtils.getUser(headerAuth);
   var data = req.params;
   var iduser = data.iduser;
   console.log(iduser)
  if (phone){
    users.getchancefflok(iduser, function(err,user){
      if(err){
        throw err;
      }
      console.log(user)
      return res.status(200).json({
        'success':true,
        'démocrate':user.démocrate,
        
      });
    });
  }
  
  else{
    return res.status(401).json({ 'error': 'wrong token' });
  }
  },
  getRandomUser : function(req, res, next) {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var phone      = jwtUtils.getUser(headerAuth);
    var data = req.params;
    var friends = [];
    
    if (phone){
      users.randomFriend( phone, function(err,myfriends){
        if(myfriends.likers.length === 0 || myfriends.likers.length === 1){
          return res.status(200).json({ 'users': null});
        }
        
        if(err){
          throw err;
        }
        var user1 = Math.floor(Math.random() * myfriends.likers.length);
        do {
          var user2 = Math.floor(Math.random() * myfriends.likers.length);
        }
        while (user1 == user2);
      
        let friend1 = {};
        friend1.path_img = myfriends.likers[user1].id.path_img;
        friend1.name = myfriends.likers[user1].id.prenon.text;
        friend1.phone = myfriends.likers[user1].id.phone;
        friend1.id = myfriends.likers[user1].id._id;
        friends.push(friend1);

        let friend2 = {};
        friend2.path_img = myfriends.likers[user2].id.path_img;
        friend2.name = myfriends.likers[user2].id.prenon.text;
        friend2.phone = myfriends.likers[user2].id.phone;
        friend2.id = myfriends.likers[user2].id._id;
        friends.push(friend2);

        return res.status(200).json({ 'users': friends});
      });
      }
    else{
      return res.status(401).json({ 'error': 'wrong token' });
    }
  },
  matchFriend : function(req, res, next) {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var phone      = jwtUtils.getUser(headerAuth);
    var data = req.body;
    var idFriend = data.idFriend;
    var match    = data.match;
    //test sur les parametres
    if (idFriend == null) {
      return res.status (400).json ({'error': 'missing parameters!'});
    }

    if (phone){
      users.matchFriend( phone,idFriend, function(err,myfriend){
        if(err){
          throw err;
        }
        if( match == 1 ){
          var CommunityBuilder = i18n.CommunityBuilder1.fr;
          users.checkBadgeCommunityBuilder( phone,CommunityBuilder, function(err,myfriend){
            if(myfriend){
              return res.status (200).json ({ 
                'success': 'true',
                'badge' : CommunityBuilder
              });
            }else{
              return res.status (200).json ({ 
                'success': 'true',
                'badge' : null 
              });
            } 
          });
        }else if(match == 5){
          var CommunityBuilder = i18n.CommunityBuilder2.fr;
          users.checkBadgeCommunityBuilder( phone,CommunityBuilder, function(err,myfriend){
            if(myfriend){
              return res.status (200).json ({ 
                'success': 'true',
                'badge' : CommunityBuilder
              });
            }else{
              return res.status (200).json ({ 
                'success': 'true',
                'badge' : null
              });
            }
          });
        }
        else if(match == 10){
          var CommunityBuilder = i18n.CommunityBuilder3.fr;
          users.checkBadgeCommunityBuilder( phone,CommunityBuilder, function(err,myfriend){
            if(myfriend){
              return res.status (200).json ({ 
                'success': 'true',
                'badge' : CommunityBuilder
              });
            }else{
              return res.status (200).json ({ 
                'success': 'true',
                'badge' : null
              });
            }
          });
        }
        else if(match == 25){
          var CommunityBuilder = i18n.CommunityBuilder4.fr;
          users.checkBadgeCommunityBuilder( phone,CommunityBuilder, function(err,myfriend){
            if(myfriend){
              return res.status (200).json ({ 
                'success': 'true',
                'badge' : CommunityBuilder
              });
            }else{
              return res.status (200).json ({ 
                'success': 'true',
                'badge' : null
              });
            }
          });
        }else {
          return res.status (200).json ({ 
            'success': 'true',
            'badge' : null
          });
        }
        
       
      });
    } 
    else{
      return res.status(401).json({ 'error': 'wrong token' });
    }
  },deleteAll : function(req, res, next) {
    var headerAuth  = req.headers['authorization'];
    var phone      = jwtUtils.getUser(headerAuth);
    if (phone){
      users.deleteAll(  function(err,myfriend){
       return res.status (200).json ({ 'message':true })
      })
    }
    else {
      return res.status(401).json({ 'error': 'wrong token' });
    }
  }
}
