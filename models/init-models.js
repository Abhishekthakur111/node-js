var DataTypes = require("sequelize").DataTypes;
var _packages = require("./packages");

function initModels(sequelize) {
  var packages = _packages(sequelize, DataTypes);


  return {
    packages,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
