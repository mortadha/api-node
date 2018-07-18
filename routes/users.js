var express = require('express');
var router = express.Router();
users = require('../models/user.js');
cours = require('../models/cours.js');
event = require('../models/event.js');
categorie = require('../models/categorie.js');

var bcrypt = require('bcrypt');
var fs = require('fs');
var parse = require('xml-parser');

var multer  = require('multer');

//config multer for upload video
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '--' + file.originalname)
    }
  });

 

  var upload = multer({ storage: storage })


/* add admin. */
router.post('/xml',upload.single('xml'), function(req, res, next) {
  var video_name = req.file.fieldname + '--' + req.file.originalname;
  console.log(video_name);
  var xml = fs.readFileSync('C:/Users/user/Downloads/0024-01.xml', 'utf8');
console.log("ici")
  var inspect = require('util').inspect;
var obj = parse(xml);
console.log(inspect(obj, { colors: true, depth: Infinity }));
});



module.exports = router;
