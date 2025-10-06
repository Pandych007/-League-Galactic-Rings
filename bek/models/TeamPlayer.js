const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TeamPlayer = sequelize.define(
  "TeamPlayer",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    tableName: "team_players",
    timestamps: true,
  }
);

module.exports = TeamPlayer;
