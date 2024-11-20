const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('packages', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tracking_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    carrier_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sender: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    weight: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    self_location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    latitude: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    longitude: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    'extremly heavy': {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    fragile: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    perisnable: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    urgent: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    current_lat: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    current_long: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'packages',
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
