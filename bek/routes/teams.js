const express = require("express");
const { Player, Team, User } = require("../models");
const { authenticate } = require("../middlewares/auth");
const { Op } = require("sequelize");
const router = express.Router();

router.get("/", async (req, res, next) => {});

router.post("/", authenticate, async (req, res, next) => {
  try {
    const { name, logo, playerIds } = req.body;
    const userId = req.user.id;
    if (!name || !playerIds || !Array.isArray(playerIds)) {
      return res.status(400).json({
        error: "Название команды и список игроков обязвтельны",
      });
    }

    if (playerIds.length > 7) {
      return res.status(400).json({
        error: "В команде не может быть больше 7 игроков",
      });
    }

    const players = await Player.findAll({
      where: {
        id: playerIds,
        is_active: true,
      },
    });

    if (players.length !== playerIds.length) {
      return res.status(400).json({
        error: "Некоторые игроки не найдены или не активны",
      });
    }

    const totalCost = players.reduce(
      (sum, player) => sum + parseFloat(player.cost),
      0
    );
    const BUDGET_LIMIT = 300;

    if (totalCost > BUDGET_LIMIT) {
      return res.status(400).json({
        error: "Превышен бюджет команды",
      });
    }

    const totalPoints = players.reduce(
      (sum, player) => sum + parseFloat(player.points),
      0
    );
    const team = await Team.create({
      name,
      logo,
      user_id: userId,
      total_points: totalPoints,
    });

    await team.addPlayers(players);

    const teamWithPlayers = await Team.findByPk(team.id, {
      include: [
        {
          model: Player,
          as: "players",
          through: { attributes: [] },
        },
      ],
    });
    res.status(201).json({
      message: "Команда успешно создана",
      team: teamWithPlayers,
      budget: BUDGET_LIMIT - totalCost,
      totalPoints,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
