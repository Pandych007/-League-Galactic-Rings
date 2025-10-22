const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Player = sequelize.define(
  "Player",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    position: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    podboru: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    peredachu: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    folv: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    perexvat: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    poteri: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    blokchotu: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    points: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "players",
    timestamps: true,
  }
);

module.exports = Player;
