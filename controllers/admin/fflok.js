var express = require('express');
var bodyParser = require('body-parser');
ffloks = require('../../models/fflok');
var jwtUtils= require('../../services/jwtAdmin.utils');
var config = require('../../config/config.js');


module.exports = {
    coutfflok : function (req,res ,next){
      // Getting auth header
      var headerAuth  = req.headers['authorization'];
      var adminId      = jwtUtils.getAdmin(headerAuth);
      if (adminId){ 
        ffloks.coutfflok( function(err, ffloks){
          if(err){
            err = err.errors
            res.status(500).json({
              err
            });
            }
          res.status(200).json({
            'success':true,
            'result':{
              'ffloks' :ffloks}
            });
        });

      }else{
        return res.status (400).json ({'error': 'wrong token'});
      }
    }
}

