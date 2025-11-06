const express = require("express");
const { Player, Team } = require("../models");
const { authenticate, authorize } = require("../middlewares/auth");
const router = express.Router();
const { Op } = require("sequelize");

router.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 20, position, search } = req.query;

    const offset = (page - 1) * limit;
    const where = { is_active: true };

    if (position) {
      where.position = position;
    }
    if (search) {
      where.name = {
        [Op.iLike]: `%${search}%`,
      };
    }
    const { count, rows: players } = await Player.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["position", "DESC"]],
    });
    res.json({
      players,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalPlayers: count,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
