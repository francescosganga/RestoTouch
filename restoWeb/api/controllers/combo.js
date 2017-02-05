var models = require("../../database/models");
var comboModel;
var comboTranslationModel;
var categoryModel;
var categoryTranslationModel;
var itemModel;
var itemTranslationModel;
var itemCategoryModel;
var _ = require('lodash');

setDatabase(models);

module.exports = {
  getAllCombo: getAllCombo,
  getCombo: getCombo,
  addCombo: addCombo,
 // updateCategory: updateCategory,
 // deleteCategory: deleteCategory,
  setDatabase: setDatabase
};

function setDatabase(m) {
  models = m;
  comboModel = models.getComboModel();
  comboTranslationModel = models.getComboTranslationModel();
  categoryModel = models.getCategoryModel();
  categoryTranslationModel = models.getCategoryTranslationModel();
  itemModel = models.getItemModel();
  itemTranslationModel = models.getItemTranslationModel();
  itemCategoryModel = models.getItemCategoryModel();
}

// GET /combo
function getAllCombos(req, res) {
  return comboModel.findAll({
    where: {userId: req.userId},
    include: [{
      model: comboTranslationModel,
      as: 'translations'
    }, {
      model: itemModel,
      as: 'items',
      include: [{
        model: itemTranslationModel,
        as: 'translations'
      }]
    }]
  }).then(function (combos) {
    //return res.json({combos: combos});
    return res.json({success: 1, description: "New Combo added"});
  });
}

// GET /combo/{id}
function getCombo(req, res) {
  var id = req.swagger.params.id.value;
  return comboModel.findOne({
    where: {
      id: id,
      userId: req.userId
    },
    include: [{
      model: comboTranslationModel,
      as: 'translations'
    }, {
      model: itemModel,
      as: 'items',
      include: [{
        model: itemTranslationModel,
        as: 'translations'
      }]
    }]
  }).then(function (combo) {
    /*if (combo) {
      return res.json(combo);
    } else {
      res.status(204).send();
    }*/
    return res.json({success: 1, description: "New Combo added"});
  });
}

// POST /combo
function addCombo(req, res) {
  var combo = req.body;
  combo.userId = req.userId;
  return comboModel.create(combo, {
    include: [{
      model: comboTranslationModel,
      as: 'translations'
    }]
  }).then(function (result) {
    var itemComboAssociations = [];
    combo.items.forEach(function (item) {
      itemComboAssociations.push({itemId: item.id, comboId: result.id});
    })
    itemComboModel.bulkCreate(itemComboAssociations);
    return res.json({success: 1, description: "New Combo added"});
  });
}