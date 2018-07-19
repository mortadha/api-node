var express = require('express');
var router = express.Router();
annonce = require('../models/annonce.js');


var bcrypt = require('bcrypt');
var fs = require('fs');
var parse = require('xml-parser');

var multer  = require('multer');

//config multer for upload video
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/')
    },
    filename: function (req, file, cb) {
      cb(null,  file.originalname)
    }
  });

 

  var upload = multer({ storage: storage })


/* add admin. */
router.post('/xml',upload.single('xml'), function(req, res, next) {
  //var video_name =  req.file.originalname;
  var xml = fs.readFileSync('../xml--0024-01.xml', 'utf8');
 var inspect = require('util').inspect;
  var obj = parse(xml);
  let positionAnnoces = 0 ;
  let ann = {};
   for (var i = 0 ; i < obj.root.children.length ; i++)
      {
        if ( obj.root.children[i].name === "ANNONCES" ){
          positionAnnoces = i ;
        }
      }
    if( positionAnnoces ==0 ){
      return res.status(200).json({'annonce': null,
    'length': 0});
    }
    for (var i = 0 ; i < obj.root.children[positionAnnoces].children.length ; i++){
      ann = annonce.FormatAnnonce(obj.root.children[positionAnnoces].children[i]);
      annonce.addAnnonce(ann,  function(err,result){
       })
    }
   return res.status(200).json({'annonce': 'success',
    'length': obj.root.children[46].children.length});
});



module.exports = router;
