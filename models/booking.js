const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('booking', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    no_of_booking: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    location: {
      type: DataTypes.STRING(245),
      allowNull: false,
      defaultValue: ""
    },
    status: {
      type: DataTypes.ENUM('0','1','2'),
      allowNull: false,
      defaultValue: "0"
    },
    price: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'booking',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
