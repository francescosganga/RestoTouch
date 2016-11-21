var models = require("../../database/models");
var menuModel;
var menuLanguageModel;
var menuTranslationsModel;
var _ = require('lodash');

setDatabase(models);

module.exports = {
  getAllMenu: getAllMenu,
  saveMenu: saveMenu,
  getMenu: getMenu,
  updateMenu: updateMenu,
  delMenu: delMenu,
  setDatabase: setDatabase
};

function setDatabase (m) {
  models = m;
  menuModel = models.getMenuModel();
  menuLanguageModel = models.getMenuLanguageModel();
  menuTranslationsModel = models.getMenuTranslationsModel();
}

//GET /menu
function getAllMenu(req, res) {
  return menuModel.findAll({where: {userId: req.userId}}).then(function(menus) {
    return res.json({ menus: menus });
  });
}

//POST /menu
function saveMenu(req, res) {
  var menu = req.body;
  menu.userId = req.userId;
  return menuModel.create(menu, {
    include: [{
      model: menuLanguageModel,
      as: 'supportedLanguages'
    }, {
      model: menuTranslationsModel,
      as: 'translations'
    }]
  }).then(function(result) {
    return res.json({success: 1, description: "Menu Added"});
  });
}

//GET /menu/{name}
function getMenu(req, res) {
  var name = req.swagger.params.name.value;
  return menuModel.findOne({
    where: {
      name: name,
      userId: req.userId
    },
    include: [{
      model: menuLanguageModel,
      as: 'supportedLanguages'
    }, {
      model: menuTranslationsModel,
      as: 'translations'
    }]
  }).then(function(menu) {
    if (menu) {
      res.json(menu);
    } else {
      res.status(204).send();
    }
  });
}

//PUT /menu/{name}
function updateMenu(req, res) {
  var menu = req.body;
  var name = req.swagger.params.name.value;
  return menuModel.findOne({
    where: {
      name: name,
      userId: req.userId
    },
    include: [{
      model: menuLanguageModel,
      as: 'supportedLanguages'
    }, {
      model: menuTranslationsModel,
      as: 'translations'
    }]
  }).then(function (oldMenu) {

    var languagesToRemove = _.differenceBy(oldMenu.supportedLanguages, menu.supportedLanguages, 'languageCode');
    var languagesToAdd = _.differenceBy(menu.supportedLanguages, oldMenu.supportedLanguages, 'languageCode');

    for (var prop in menu) {
      if(prop != 'translations')
          oldMenu[prop] = menu[prop];
    }

    oldMenu.translations.forEach(function(translation) {
      var newTranslation = _.find(menu.translations, function (tr) {return tr.languageCode === translation.languageCode});
      for (var prop in newTranslation) {
          translation[prop] = newTranslation[prop];
      }
      translation.save();
      _.remove(menu.translations, function (tr) {return tr.languageCode === translation.languageCode});
    });

    menu.translations.forEach(function (translation) {
      translation.menuId = menu.id;
    });
    // Create the new translations
    menuTranslationsModel.bulkCreate(menu.translations);

    oldMenu.save().then(function (result) {
      languagesToRemove.forEach(function (language) {
        menuLanguageModel.destroy({where: {'languageCode': language.languageCode, 'menuId': menu.id}});
        menuTranslationsModel.destroy({where: {'languageCode': language.languageCode, 'menuId': menu.id}});
        _.remove(oldMenu.translations, function (translation) { return translation.languageCode == language.languageCode});
      })

      languagesToAdd.forEach(function (language) {
        language.menuId = menu.id;
      })

      menuLanguageModel.bulkCreate(languagesToAdd).then(function (result) {
        return res.json({success: 1, description: 'Menu Updated'});
      })

    });        
  });
}

//DELETE /menu/{name}
function delMenu(req, res) {
  var name = req.swagger.params.name.value;
  return menuModel.destroy({
    where: {
      name: name,
      userId: req.userId
    }
  }).then(function(result) {
    return res.json({success: 1, description: "Menu Deleted"});
  });
}
