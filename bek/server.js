const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models");
const authRoutes = require("./routes/auth");
const playersRoutes = require("./routes/players");
const teamsRoutes = require("./routes/teams");
const rankingRoutes = require("./routes/ranking");

const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;
