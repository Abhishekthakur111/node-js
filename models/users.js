const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    role: {
      type: DataTypes.ENUM('0','1','2','3'),
      allowNull: false,
      defaultValue: "1"
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    status: {
      type: DataTypes.ENUM('0','1'),
      allowNull: false,
      defaultValue: "1"
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    phone_number: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: true,
    paranoid: true
  });
};
