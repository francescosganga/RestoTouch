var models = require("../../database/models");
var menuCategoryModel;
setDatabase(models);


module.exports = {
  setDatabase: setDatabase,
  saveMenuCategory: saveMenuCategory,
  delMenuCategory: delMenuCategory

};

function setDatabase (m) {
  models = m;
  menuCategoryModel = models.getmenuCategoryModel();
}

//POST /menuCategory
function saveMenuCategory(req, res) {

  var menucategory = req.body;
  return menuCategoryModel.create(menucategory).then(function(result){
    return res.json({success: 1, description: "Added Categor(y/ies) to Menu"});
  });

}

//DELETE /menuCategory/{menuId}{categoryId}
function delMenuCategory(req, res) {
  var menuId = req.swagger.params.menuId.value;
  var categoryId = req.swagger.params.restaurantId.value;

 return menuCategoryModel.destroy({
   where: {
     MenuId: menuId,
     CategoryId: categoryId
   }
 }).then(function (result) {
 return res.json({success: 1, description: "Deleted Categories from a Menu"});
 });

}
