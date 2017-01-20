var Sequelize = require('sequelize');
var configDB = require('../config/database.js');
var sequelize = new Sequelize(configDB.url, {logging: console.log});
var userModel = sequelize.import('./models/users.js');
var restaurantModel = sequelize.import('./models/restaurants.js');
var businessHoursModel = sequelize.import('./models/businessHours.js');
var paymentsModel = sequelize.import('./models/payments.js');
var menuModel = sequelize.import('./models/menus.js');
var menuTranslationsModel = sequelize.import('./models/menuTranslations');
var restaurantMenuModel = sequelize.import('./models/restaurantMenu.js');
var menuCategoryModel = sequelize.import('./models/menuCategory.js');
var categoryModel = sequelize.import('./models/categories.js');
var categoryTranslationModel = sequelize.import('./models/categoriesTranslations.js');
var restaurantsLanguagesModel = sequelize.import('./models/restaurantsLanguages.js');
var restaurantsTranslationsModel = sequelize.import('./models/restaurantsTranslations.js');
var itemModel = sequelize.import('./models/items.js');
var itemSizesModel = sequelize.import('./models/itemSizes.js');
var itemTranslationModel = sequelize.import('./models/itemsTranslations.js');
var itemCategoryModel = sequelize.import('./models/itemCategory.js');
var ingredientModel = sequelize.import('./models/ingredient.js');
var ingredientGroupModel = sequelize.import('./models/ingredientGroup.js');
var supportedLanguageModel = sequelize.import('./models/supportedLanguages.js');
var disabledMenuItemCategoryModel = sequelize.import('./models/disabledMenuItemCategory.js');
var itemSizesTranslationsModel = sequelize.import('./models/itemSizeTranslations.js');

// Enable this if you want to drop all tables and create them,
// DO NOT COMMIT THIS AS TRUE THOUGH
var dropTable = false;

userModel.sync({force: dropTable}).then(function () {

  // User has to be created before these tables are created
  userModel.hasMany(restaurantModel, {as: 'restaurants', onDelete: 'cascade', foreignKey: 'userId'});

  userModel.hasMany(supportedLanguageModel, {
    as: 'supportedLanguages',
    onDelete: 'cascade',
    foreignKey: 'userId'
  });
  supportedLanguageModel.sync({force: dropTable});

  restaurantModel.sync({force: dropTable}).then(function () {
    //Restaurant has to be created before these tables are created

    restaurantModel.hasMany(restaurantsLanguagesModel, {
      as: 'supportedLanguages',
      onDelete: 'cascade',
      foreignKey: 'restaurantId'
    });
    restaurantsLanguagesModel.sync({force: dropTable});

    restaurantModel.hasMany(restaurantsTranslationsModel, {
      as: 'translations',
      onDelete: 'cascade',
      foreignKey: 'restaurantId'
    });
    restaurantsTranslationsModel.sync({force: dropTable});

    restaurantModel.hasMany(businessHoursModel, {
      as: 'businessHours',
      onDelete: 'cascade',
      foreignKey: 'restaurantId'
    });
    businessHoursModel.sync({force: dropTable});

    restaurantModel.hasMany(paymentsModel, {
      as: 'payments',
      onDelete: 'cascade',
      foreignKey: 'restaurantId'
    });
    paymentsModel.sync({force: dropTable});
  });

  categoryModel.belongsTo(userModel, {onDelete: 'cascade', foreignKey: 'userId'});
  categoryModel.sync({force: dropTable}).then(function () {

    categoryModel.hasMany(categoryTranslationModel, {
      as: 'translations',
      onDelete: 'cascade',
      foreignKey: 'categoryId'
    });
    categoryTranslationModel.sync({force: dropTable});

  });

  menuModel.belongsTo(userModel, {onDelete: 'cascade', foreignKey: 'userId'});
  menuModel.sync({force: dropTable}).then(function () {

    restaurantModel.belongsToMany(menuModel, {
      through: restaurantMenuModel,
      onDelete: 'cascade',
      foreignKey: "restaurantId"
    });
    menuModel.belongsToMany(restaurantModel, {
      through: restaurantMenuModel,
      onDelete: 'cascade',
      foreignKey: "menuId"
    });
    restaurantMenuModel.sync({force: dropTable});

    menuModel.hasMany(menuTranslationsModel, {
      as: 'translations',
      onDelete: 'cascade',
      foreignKey: 'menuId'
    });
    menuTranslationsModel.sync({force: dropTable});

    menuModel.belongsToMany(categoryModel, {
      as: 'categories',
      through: menuCategoryModel,
      onDelete: 'cascade',
      foreignKey: 'menuId'
    });
    categoryModel.belongsToMany(menuModel, {
      as: 'categories',
      through: menuCategoryModel,
      onDelete: 'cascade',
      foreignKey: 'categoryId'
    });
    menuCategoryModel.sync({force: dropTable});

  });

  userModel.hasMany(itemModel, {as: 'items', onDelete: 'cascade', foreignKey: 'userId'});


  itemModel.sync({force: dropTable}).then(function () {
    itemModel.hasMany(itemSizesModel, {as: 'sizes', onDelete: 'cascade', foreignKey: 'itemId'});
    itemSizesModel.sync({force: dropTable});
    itemSizesModel.hasMany(itemSizesTranslationsModel, {
      as: 'translations',
      onDelete: 'cascade',
      foreignKey: 'itemSizesId'
    });
    itemSizesTranslationsModel.sync({force:dropTable});
    itemModel.hasMany(itemTranslationModel, {as: 'translations', onDelete: 'cascade', foreignKey: 'itemId'});
    itemTranslationModel.sync({force: dropTable});

    itemModel.belongsToMany(categoryModel, {
      as: 'categories',
      through: itemCategoryModel,
      onDelete: 'cascade',
      foreignKey: "itemId"
    });
    categoryModel.belongsToMany(itemModel, {
      as: 'items',
      through: itemCategoryModel,
      onDelete: 'cascade',
      foreignKey: "categoryId"
    });
    itemCategoryModel.sync({force: dropTable}).then(function () {
      itemCategoryModel.belongsToMany(menuModel, {
        as: 'menus',
        through: disabledMenuItemCategoryModel,
        onDelete: 'cascade',
        foreignKey: "categoryItemId"
      });
      menuModel.belongsToMany(itemCategoryModel, {
        as: 'disabledCategoryItems',
        through: disabledMenuItemCategoryModel,
        onDelete: 'cascade',
        foreignKey: "menuId"
      });
      disabledMenuItemCategoryModel.sync({force: dropTable});
    });

    itemModel.hasMany(ingredientGroupModel, {as: 'ingredientGroups', onDelete: 'cascade', foreignKey: 'itemId'});
    ingredientGroupModel.sync({force: dropTable});
    ingredientGroupModel.hasMany(ingredientModel, {
      as: 'ingredients',
      onDelete: 'cascade',
      foreignKey: 'ingredientGroupId'
    });
    ingredientModel.sync({force: dropTable});
  });

});


exports.connectToDb = function () {

}

exports.getUserModel = function () {
  return userModel;
};

exports.getRestaurantModel = function () {
  return restaurantModel;
};

exports.getCategoryModel = function () {
  return categoryModel;
};

exports.getCategoryTranslationModel = function () {
  return categoryTranslationModel;
}

exports.getMenuModel = function () {
  return menuModel;
};

exports.getMenuTranslationsModel = function () {
  return menuTranslationsModel;
}

exports.getRestaurantMenuModel = function () {
  return restaurantMenuModel;
};

exports.getMenuCategoryModel = function () {
  return menuCategoryModel;
};

exports.getRestaurantsLanguageModel = function () {
  return restaurantsLanguagesModel;
}

exports.getRestaurantsTranslationModel = function () {
  return restaurantsTranslationsModel;
}

exports.getBusinessHoursModel = function () {
  return businessHoursModel;
}

exports.getPaymentsModel = function () {
  return paymentsModel;
}

exports.getItemModel = function () {
  return itemModel;
}

exports.getItemSizesModel = function () {
  return itemSizesModel;
}

exports.getItemSizeTranslationsModel = function () {
  return itemSizesTranslationsModel;
}

exports.getItemTranslationModel = function () {
  return itemTranslationModel;
}

exports.getItemCategoryModel = function () {
  return itemCategoryModel;
}

exports.getIngredientModel = function () {
  return ingredientModel;
}

exports.getIngredientGroupModel = function () {
  return ingredientGroupModel;
}

exports.getSupportedLanguageModel = function () {
  return supportedLanguageModel;
}

exports.getDisabledMenuItemCategoryModel = function () {
  return disabledMenuItemCategoryModel;
}
