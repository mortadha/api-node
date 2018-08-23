var express = require('express');
var bodyParser = require('body-parser');
admins = require('../../models/admin.js');
var jwtUtils= require('../../services/jwtAdmin.utils');
var config = require('../../config/config.js');
var bcrypt = require('bcrypt');


//verification email
const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//verification password
const PASSWORD_REGEX  = /^(?=.*\d).{4,8}$/;

module.exports = {
    /**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       password:
 *         type: string
 *       phone:
 *         type: string
 *       name:
 *         type: user
 *       prenon:
 *         type: string
 *       code:
 *         type: string
 *       active:
 *         type: boolean
 *       create_date:
 *         type: string
*/
addAdmin: function(req, res, next){
    
    var admin = req.body;
    var email = admin.email;
    var password = admin.password;
    var phone = admin.phone;
    var name = admin.name;
    var prenon = admin.prenon;
    
    if (email == null || password==null || phone==null || name==null || prenon==null) {
        return res.status (400).json ({'error': 'missing parameters!'});
    }

    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ 'error': 'email is not valid' });
    }

    if (!PASSWORD_REGEX.test(password)) {
        return res.status(400).json({ 'error': 'password invalid (must length 4 - 8 and include 1 number at least)' });
    }
    bcrypt.hash(password,5, function(err, bcryptedPassword) {
        admin.password = bcryptedPassword;
        admins.addAdmin(admin, function(err, admin){
          if(err){
              err = err.errors
              res.status(500).json({
                err
              });
              }
            res.status(200).json({
              'success':true,
              'result':{
                'admin' :admin
              }
              });
          });
    });
    
    },
    loginAdmin: function(req, res, next){
      
      var admin = req.body;
      var email = admin.email;
      var password = admin.password;
      if (email == null || password==null) {
        return res.status (400).json ({'error': 'missing parameters!'});
      }
      admins.existAdmin(email, function(err, admin){
        if(admin.length > 0){
          bcrypt.compare(password, admin[0].password, function(err, resbcrypt) {
            if(resbcrypt){
              res.status(200).json({
                'success':true,
                'result':{
                'admin' :admin[0],
                'token': jwtUtils.generateTokenForAdmin(admin[0])
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
    },
    getAllAdmin: function(req, res, next){
      admins.getAdmins( function(err, admins){
        if(err){
          err = err.errors
          res.status(500).json({
            err
          });
          }
        res.status(200).json({
          'success':true,
          'result':{
            'admins' :admins}
          });
      });
    }
}

