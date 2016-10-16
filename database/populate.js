var Sequelize = require('sequelize');
var configDB = require('../config/database.js');
var sequelize = new Sequelize(configDB.url);
var userModel = sequelize.import('./models/users.js');
var passwordHasher = require("../api/helpers/passwordHash.js");

var harleyPasswordData = passwordHasher.saltHashPassword('password1');
var davidPasswordData = passwordHasher.saltHashPassword('password2');
var tamyPasswordData = passwordHasher.saltHashPassword('password3');
var hilaryPasswordData = passwordHasher.saltHashPassword('password4');
var alexPasswordData = passwordHasher.saltHashPassword('password5');
var samerPasswordData = passwordHasher.saltHashPassword('password6');

// 1
userModel.bulkCreate([{
  firstName: 'harley',
  lastName: 'mcphee',
  email: 'harley@gmail.com',
  phoneNumber: '514 514 1111',
  password: harleyPasswordData.passwordHash,
  salt: harleyPasswordData.salt,
  emailVerified: true},
// 2
  {
    firstName: 'david',
    lastName: 'bastien',
    email: 'davidbastien@gmail.com',
    phoneNumber: '514 514 2222',
    password: davidPasswordData.passwordHash,
    salt: davidPasswordData.salt,
    emailVerified: true
  },
// 3
  {
    firstName: 'tamy',
    lastName: 'huynh',
    email: 'tamyhuynh@gmail.com',
    phoneNumber: '514 514 3333',
    password: tamyPasswordData.passwordHash,
    salt: tamyPasswordData.salt,
    emailVerified: true
  },
// 4
  {
    firstName: 'hilary',
    lastName: 'chan',
    email: 'hilary@gmail.com',
    phoneNumber: '514 514 4444',
    password: hilaryPasswordData.passwordHash,
    salt: hilaryPasswordData.salt,
    emailVerified: true
  },
// 5
  {
    firstName: 'alex',
    lastName: 'pelletier',
    email: 'alex@gmail.com',
    phoneNumber: '514 514 5555',
    password: alexPasswordData.passwordHash,
    salt: alexPasswordData.salt,
    emailVerified: true
  },
// 6
  {
    firstName: 'samer',
    lastName: 'elachkar',
    email: 'samer@gmail.com',
    phoneNumber: '514 514 6666',
    password: samerPasswordData.passwordHash,
    salt: samerPasswordData.salt,
    emailVerified: true
  }]);
