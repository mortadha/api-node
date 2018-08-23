var express = require('express');
var usersController = require('./controllers/users');
var adminController = require('./controllers/admin/admin');
var placeController = require('./controllers/admin/place');
var tagController = require('./controllers/admin/tag');
var userTagController = require('./controllers/tag');
var fflokController = require('./controllers/fflok');
var restaurateursController = require('./controllers/restaurateur');
var dateFormat = require('dateformat');
var path       = require('path');
var crypto     = require('crypto');
var multer     = require('multer');

//config multer for upload video
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/users')
    },
    filename: function (req, file, cb) {
      let id = req.headers['authorization'].substr(40, 30);
      cb(null,id+"-"+ file.fieldname + '-' + dateFormat(new Date(), "yyyy-mm-dd") + '-' + file.originalname)
    }
  });

  //filter video
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'video/x-flv' || file.mimetype === 'video/mp4' || file.mimetype === 'application/x-mpegURL' || file.mimetype === 'video/MP2T'
    || file.mimetype === 'video/3gpp' || file.mimetype === 'video/quicktime' || file.mimetype === 'video/x-msvideo' || file.mimetype === 'video/x-ms-wmv'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
   };

  var upload = multer({ storage: storage,fileFilter: fileFilter })

  var storagePlace = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/places')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + dateFormat(new Date(), "yyyy-mm-dd") + '-' + file.originalname)
    }
  });

    //filter image
    const imageFilter = (req, file, cb) => {
      // reject a file
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
      } else {
        cb(null, false);
      }
     };

  var storageRestaurateur = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/places')
    },
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return cb(err)  
        cb(null, raw.toString('hex') + path.extname(file.originalname))
      })      
    }
  });   
  var uploadImage      = multer({ storage: storagePlace,fileFilter: imageFilter })
  var uploadImageUSer  = multer({ storage: storage,fileFilter: imageFilter })
  var uploadImagePlace = multer({ storage: storageRestaurateur,fileFilter: imageFilter });
  
//All route
exports.router =(function() {
    var apiRouter = express.Router();

  
    //users routes
    
    //get all user
    apiRouter.route('/users/').get(usersController.getAllUsers);

    //delete all user
    apiRouter.route('/users/deleteAll').delete(usersController.deleteAll);

    //add user(inactive) if not exist if exist send anather code(active) 
    apiRouter.route('/users/step1/addUser').post(usersController.step1);

    //api verier code (body : code and registrationToken)
    apiRouter.route('/users/step2/addUser').put(usersController.step2);

    //api update prenom user 
    apiRouter.route('/users/step3/addUser/').put(usersController.step3);

    //api update  video 
    apiRouter.put('/users/step4/addUser/', upload.single('video'),  function(req, res) {
      usersController.step4(req,res);
    });

    //api update  video 
    apiRouter.put('/users/step5/addUser/', uploadImageUSer.single('image'),  function(req, res) {
      usersController.step5(req,res);
    });


    //api check Users
    apiRouter.route('/users/checkUsers').post(usersController.checkUsers);
    
    //api update position
    apiRouter.route('/users/update-position').put(usersController.updateposition);


     //api update position for 6h matin
     apiRouter.route('/users/updatepositionSendInvitaion').put(usersController.updatepositionSendInvitaion);

    //api update etat
    apiRouter.route('/users/update-etat').put(usersController.updateStatu);

    //api get my profil
    apiRouter.route('/users/getMyProfil').get(usersController.getMyProfil);

    // add friend if exist if not exist si non invitation via sms and mail
    apiRouter.route('/users/add-friend').put(usersController.addFriend);

    //api get my list of friend
    apiRouter.route('/users/getFriends').get(usersController.getFriends);

    //get Proximite Friends
    apiRouter.route('/users/getProximiteFriends').post(usersController.getProximiteFriends);

    //get Proximite No Friends
    apiRouter.route('/users/getProximiteNoFriends').get(usersController.getProximiteNoFriends);

    //Get all Tags
    apiRouter.route('/users/getTagsfflok').get(userTagController.getTagsfflok);


    //flook

    //get fflok
    apiRouter.route('/users/getfflok/:id').get(fflokController.getfflok);

    //get all my fflok
    apiRouter.route('/users/getAllMyfflok').get(fflokController.getAllMyfflok);

    //create fflok
    apiRouter.route('/users/createfflok').post(fflokController.ceratefflok);

    //update place fflok
    apiRouter.route('/users/updatePlacefflok').put(fflokController.updatePlacefflok);

    //acept  fflok
    apiRouter.route('/users/aceptFFlok').put(fflokController.aceptFFlok);

    //acept  fflok
    apiRouter.route('/users/leaveFFlok').put(fflokController.leaveFFlok);

    //vote  fflok
    apiRouter.route('/users/voteFFlok').put(fflokController.votefflok);

    //get chance fflok
    apiRouter.route('/users/getchancefflok/:iduser').get(usersController.getchancefflok);

    //add picture to fflok
    apiRouter.put('/users/addPicturesfflok/', uploadImage.array('image'),  function(req, res) {
      fflokController.addPicturesfflok(req,res);
    });

    //get Places
    apiRouter.route('/users/getProximitePlace').post(fflokController.getProximitePlace);

    //get Places explorer 
    apiRouter.route('/users/getProximitePlaceExplorer').post(fflokController.getProximitePlaceExplorer);

    //get check favorite place or no 
    apiRouter.route('/users/checkFavoritePlace').post(usersController.checkFavoritePlace);

    //add Favorite Place
    apiRouter.route('/users/addFavoritePlace').put(usersController.addFavoritePlace);

     //find  Tags
     apiRouter.route('/users/findTagsfflok').post(userTagController.fingTagsfflok);


    //match

    //getRandomUser
    apiRouter.route('/users/getRandomUser').get(usersController.getRandomUser);

     //match Friend
     apiRouter.route('/users/matchFriend').put(usersController.matchFriend);



     //Restaurateur 

     //login Restaurant
     apiRouter.route('/restaurateurs/login').post(restaurateursController.login);

     //update Status Restaurant
     apiRouter.route('/restaurateurs/updateStatus').put(restaurateursController.updateStatus);

     //add Tag  Restaurant
     apiRouter.route('/restaurateurs/addTagPlace').put(restaurateursController.addTagPlace);
     //add tag  Restaurant
     apiRouter.route('/restaurateurs/addTagPlace').put(restaurateursController.addTagPlace);
    //Add message to Restaurant
    apiRouter.route('/restaurateurs/addMessagePlace').post(restaurateursController.addMessagePlace);
    //Delete message of Restaurant
    apiRouter.route('/restaurateurs/deleteMessage').post(restaurateursController.DeleteMessage);
    // Add picture to restaurant 
    apiRouter.put('/restaurateurs/addPictures/', uploadImagePlace.array('image'),  function(req, res) {
      restaurateursController.addPictures(req,res);
    });
    //Delete picture of Restaurant
    apiRouter.route('/restaurateurs/deletePicture').delete(restaurateursController.deletePicture);
    
    return apiRouter;
})();