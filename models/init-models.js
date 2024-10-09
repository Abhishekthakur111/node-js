var DataTypes = require("sequelize").DataTypes;
var _booking = require("./booking");

function initModels(sequelize) {
  var booking = _booking(sequelize, DataTypes);


  return {
    booking,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
