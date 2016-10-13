var models = require("../../database/models");
var restaurantModel;
var menuModel;
setDatabase(models);

module.exports = {
  getAll: getAll,
  save: save,
  get: get,
  update: update,
  del: del,
  setDatabase: setDatabase
};

function setDatabase (m) {
  models = m;
  restaurantModel = models.getRestaurantModel();
  menuModel = models.getMenuModel();
}

//GET /restaurant
function getAll(req, res) {
  return restaurantModel.findAll({
    where: {userId: req.userId},
    include: [{
      model: menuModel
    }]
  }).then(function(restaurants) {
    return res.json({ restaurants: restaurants });
  });
}

//POST /restaurant
function save(req, res) {
  var restaurant = req.body;
  restaurant.userId = req.userId;
  return restaurantModel.create(restaurant).then(function(result) {
    return res.json({success: 1, description: "Restaurant Added"});
  });
}

//GET /restaurant/{name}
function get(req, res) {
  var name = req.swagger.params.name.value;
  return restaurantModel.findOne({
    where: {
      name: name,
      userId: req.userId
    },
    include: [{
      model: menuModel
    }]
  }).then(function(restaurant) {
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(204).send();
    }
  });
}

//PUT /restaurant/{name}
function update(req, res) {
  var restaurant = req.body;
  var name = req.swagger.params.name.value;
  return restaurantModel.update(restaurant, {
    where: {
      name: name,
      userId: req.userId
    }
  }).then(function(result) {
    return res.json({success: 1, description: "Restaurant Updated"});
  });
}

//DELETE /restaurant/{name}
function del(req, res) {
  var name = req.swagger.params.name.value;
  return restaurantModel.destroy({
    where: {
      name: name,
      userId: req.userId
    }
  }).then(function(result) {
    return res.json({success: 1, description: "Restaurant Deleted"});
  });
}
