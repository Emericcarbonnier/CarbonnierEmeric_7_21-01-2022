const bcrypt = require('bcrypt')
const models = require('../models')
const jwtUtils  = require('../utils/jwt.utils')
const asyncLib = require ('async')

const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX  = /^(?=.*\d).{4,20}$/;


exports.register = (req, res, next) => {

       let firstname = req.body.firstname;
       let lastname = req.body.lastname;
       let email = req.body.email;
       let username = req.body.username;
       let password = req.body.password;

       if (email == null || username == null || password == null || firstname == null || lastname == null){
           return res.status(400).json ({'error' : 'missing parameters'})
       }
       if (username.length >= 21 || username.length <= 4) {
        return res.status(400).json({ 'error': 'wrong username (must be length 5 - 20)' });
      }
  
      if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ 'error': 'email is not valid' });
      }
  
      if (!PASSWORD_REGEX.test(password)) {
        return res.status(400).json({ 'error': 'password invalid (must length 4 - 8 and include 1 number at least)' });
      }
  
      asyncLib.waterfall([
        function(done) {
          models.User.findOne({
            attributes: ['email'],
            where: { email: email }
          })
          .then(function(userFound) {
            done(null, userFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify user' });
          });
        },
        function(userFound, done) {
          if (!userFound) {
            bcrypt.hash(password, 5, function( err, bcryptedPassword ) {
              done(null, userFound, bcryptedPassword);
            });
          } else {
            return res.status(409).json({ 'error': 'user already exist' });
          }
        },

        function(userFound, bcryptedPassword, done) {
          const newUser = models.User.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            username: username,
            password: bcryptedPassword,
            isAdmin: 0
          })

          .then(function(newUser) {
            done(newUser);
          })

          .catch(function(err) {
            return res.status(500).json({ 'error': 'cannot add user' });
          });
        }
      ], 
      
      function(newUser) {
        if (newUser) {
          return res.status(201).json({
            'userId': newUser.id
          });
        } else {
          return res.status(500).json({ 'error': 'cannot add user' });
        }
      });

    }

exports.login = (req, res, next) => {
    let email    = req.body.email;
    let password = req.body.password;

    if (email == null ||  password == null) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }

    asyncLib.waterfall([
      function(done) {
        models.User.findOne({
          where: { email: email }
        })
        .then(function(userFound) {
          done(null, userFound);
        })
        .catch(function(err) {
          const errors = signInErrors(err)
          return res.status(500).json({errors});
        });
      },
      function(userFound, done) {
        if (userFound) {
          bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
            done(null, userFound, resBycrypt);
          });
        } else {
          return res.status(404).json({error: 'user not exist in DB' });
        }
      },
      function(userFound, resBycrypt, done) {
        if(resBycrypt) {
          done(userFound);
        } else {
          return res.status(403).json({error: 'invalid password'});
        }
      }
    ], function(userFound) {
      if (userFound) {
        return res.status(201).json({
          'userId': userFound.id,
          'token': jwtUtils.generateTokenForUser(userFound)
        });
      } else {
        return res.status(500).json({ 'error': 'cannot log on user' });
      }
    });
  }

