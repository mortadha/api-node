var express = require('express');
var usersController = require('./controllers/users');
var adminController = require('./controllers/admin/admin');
var placeController = require('./controllers/admin/place');
var tagController = require('./controllers/admin/tag');
var userTagController = require('./controllers/tag');
var fflokController = require('./controllers/admin/fflok');
var userController = require('./controllers/admin/user');
var dateFormat = require('dateformat');

var multer  = require('multer');

//config multer for upload video
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/users')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + dateFormat(new Date(), "yyyy-mm-dd") + '-' + file.originalname)
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
      cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
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

  var uploadImage = multer({ storage: storagePlace,fileFilter: imageFilter })
//All route
exports.router =(function() {
    var apiRouter = express.Router();
    
    //admin routes

    //add admin
    apiRouter.route('/admin/addAdmin').post(adminController.addAdmin);

    //login admin
    apiRouter.route('/admin/loginAdmin').post(adminController.loginAdmin);

    //Get all admin
    apiRouter.route('/admin/getAllAdmin').get(adminController.getAllAdmin);
    
    //add place
    apiRouter.post('/admin/addPlace', uploadImage.single('image'),  function(req, res) {
      placeController.addPlace(req,res);
    });

    //get places
    apiRouter.route('/admin/getPlaces').get(placeController.getPlaces);

    //get places
    apiRouter.route('/admin/coutPlace').get(placeController.coutPlace);


    //add tag 
    apiRouter.route('/admin/addTag').post(tagController.addTag);

    //Get all Tags
    apiRouter.route('/admin/getTags').get(tagController.getTags);

    //Get all users
    apiRouter.route('/admin/getUsers').get(userController.getAllUsers);

    //count fflok
    apiRouter.route('/admin/coutfflok').get(fflokController.coutfflok);

    //count user
    apiRouter.route('/admin/coutUser').get(userController.coutUser);

    //count user
    apiRouter.route('/admin/deletePlace/:id').delete(placeController.deletePlace);

    //count user
    apiRouter.route('/admin/getPlace/:id').get(placeController.getPlace);

    return apiRouter;
})();