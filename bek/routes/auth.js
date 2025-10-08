const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const authonticate = require("../middlewares/auth");
const { use } = require("react");
const router = express.Router();

//POST /auth/register

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Имя, email и пароль обязательны",
      });
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        error: "Пользователь с таким email уже существует",
      });
    }
    const user = await User.create({
      name,
      email,
      password,
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.status(201).json({
      message: "ПОльзователь успещно зарегистрирован",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

//POST /auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: "email и пароль обязательны",
      });
    }
    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({
        error: "Неверный email или пароль",
      });
    }
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(400).json({
        error: "Неверный email или пароль",
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({
      message: "Успешный вход",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

//GET /athu/me
router.get("/me", authonticate, async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

module.exports = router;
