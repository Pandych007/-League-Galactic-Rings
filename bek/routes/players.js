const express = require("express");
const { Player, Team } = require("../models");
const { authenticate, authorize } = require("../middlewares/auth");
const router = express.Router();

router.get("/", async (req, res, next) => {});

module.exports = router;
