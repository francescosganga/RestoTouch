var models = require("../../database/models");
var passwordHasher = require("../helpers/passwordHash");
var jwt = require('jwt-simple');
var _ = require('lodash');
var configAuth = require('../../config/auth');
var supportedLanguageModel;
var userModel;

setDatabase(models);

module.exports = {
  register: register,
  login: login,
  setDatabase: setDatabase,
  getAccountSettings: getAccountSettings,
  saveAccountSettings: saveAccountSettings,
  getSupportedLanguages: getSupportedLanguages,
  saveNewSupportedLanguage: saveNewSupportedLanguage,
  getProfile: getProfile,
  saveProfile: saveProfile
};

function setDatabase(m) {
  models = m;
  userModel = models.getUserModel();
  supportedLanguageModel = models.getSupportedLanguageModel();
}

function register(req, res) {
  var user = req.body;
  var passwordData = passwordHasher.saltHashPassword(user.password);
  user.password = passwordData.passwordHash;
  user.salt = passwordData.salt;
  //Set employee password as the same by default
  user.employeePassword = passwordData.passwordHash;
  user.employeeSalt = passwordData.salt;
  user.supportedLanguages = [{name: "English", languageCode: "en"}];
  return userModel.create(user, {
    include: [{
      model: supportedLanguageModel,
      as: 'supportedLanguages'
    }]
  }).then(function (newUser) {

    var info = userInfo(newUser.dataValues);
    return res.json({success: 1, description: "User registered", "user": info.user, "accessToken": info.token});
  });
}

function userInfo(user) {
  var token = genToken(user);
  return {
    user: {
      "id": user.id,
      "firstName": user.firstName,
      "lastName": user.lastName,
      "email": user.email,
      "isEmployee": user.isEmployee,
    },
    "token": token.token
  }
}

function getAccountSettings(req, res) {
  //will eventually have more than just supported language model to return
  return supportedLanguageModel.findAll({
    where: {userId: req.userId},
    order: "name"
  }).then(function (supportedLanguages) {
    return res.json({success: 1, 'supportedLanguages': supportedLanguages});
  })
}

function saveNewSupportedLanguage(req, res) {
  var supportedLanguage = req.body;
  supportedLanguage.userId = req.userId;
  return supportedLanguageModel.create(supportedLanguage).then(function () {
    return res.json({success: 1, description: "Language added"});

  })
}

function getSupportedLanguages(req, res) {
  return supportedLanguageModel.findAll({
    where: {userId: req.userId},
    order: "name"
  }).then(function (supportedLanguages) {
    return res.json(supportedLanguages);
  })
}

function saveAccountSettings(req, res) {
  var accountSettings = req.body;
  return supportedLanguageModel.findAll({where: {userId: req.userId}}).then(function (supportedLanguages) {

    var languagesToRemove = _.differenceBy(supportedLanguages, accountSettings.supportedLanguages, 'languageCode');
    var newLanguagesToAdd = _.differenceBy(accountSettings.supportedLanguages, supportedLanguages, 'languageCode');

    languagesToRemove.forEach(function (language) {
      supportedLanguageModel.destroy({where: {'languageCode': language.languageCode, 'userId': req.userId}});
      //todo remove all the users translations using this language
    });

    newLanguagesToAdd.forEach(function (language) {
      language.userId = req.userId;
    })
    supportedLanguageModel.bulkCreate(newLanguagesToAdd).then(function (result) {
      return res.json({success: 1, description: "Account Settings Updated"});
    })
  })

}

function genToken(user) {
  var expires = expiresIn(10000);
  var token = jwt.encode({
    exp: expires,
    email: user.email,
    id: user.id
  }, configAuth.secret);

  return {
    token: token,
    expires: expires,
  };
}

function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

function login(req, res) {
  var user = req.body;

  return userModel.findOne({
    where: {email: user.email}
  }).then(function (newUser) {
    if (!newUser) {
      res.status(401);
      return res.json({message: "User access denied"});
    }
    newUser.isEmployee = user.isEmployee;
    var info = userInfo(newUser);
    if(newUser.isEmployee) {
      var passwordMatched = passwordHasher.comparePassword(user.employeePassword, newUser.employeeSalt, newUser.employeePassword);
      if (passwordMatched) {
        newUser.save().then(function (result) {
          return res.json({success: 1, description: "User logged in", "user": info.user, "accessToken": info.token});
        });
      } else {
        res.status(401);
        return res.json({message: "User access denied"});
      }
    }
    else {
      var passwordMatched = passwordHasher.comparePassword(user.password, newUser.salt, newUser.password);
      if (passwordMatched) {
        newUser.save().then(function (result) {
          return res.json({success: 1, description: "User logged in", "user": info.user, "accessToken": info.token});
        });
      } else {
        res.status(401);
        return res.json({message: "User access denied"});
      }
    }
  });
}

//GET /profile
//(returns the user object)
function getProfile(req, res) {
  return userModel.findOne({
    where: {id: req.userId},
    attributes: ['firstName', 'lastName', 'email']}).then(function (user) {
    return res.json(user);
  })
}

//PUT /profile
//modifies user profile information
function saveProfile(req, res) {
  var user = req.body;
  return userModel.findOne({
    where: {id: req.userId},
  }).then(function (oldUser) {
    var passwordMatched = (user.password === oldUser.password);
    if(!passwordMatched) {
      var passwordData = passwordHasher.saltHashPassword(user.password);
      user.password = passwordData.passwordHash;
      user.salt = passwordData.salt;
    }
    var employeePasswordMatched = (user.employeePassword === oldUser.employeePassword);
    if(!employeePasswordMatched) {
      var employeePasswordData = passwordHasher.saltHashPassword(user.employeePassword);
      user.employeePassword = employeePasswordData.passwordHash;
      user.employeeSalt = employeePasswordData.salt;
    }
    for(var prop in user) {
      oldUser[prop] = user[prop];
    }

    oldUser.save().then(function (result) {
      return res.json({success: 1, description: 'Profile Updated'});
    });
  });
}
