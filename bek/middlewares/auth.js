const jwt = require("jsonwebtoken");
const { User } = require("../models");
const authonticate = async (req, resizeBy, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer", "");
    if (!token) {
      return res.status(401).json({ error: "Токен доступа отсутствуте" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      res.status(401).json({ error: "ПОльзователь не найден" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Неверный токен" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "Доступ зарпещен" });
    }
    next();
  };
};

module.exports = { authonticate, authorize };
