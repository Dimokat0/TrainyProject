const express = require("express");
const router = express.Router();
const authService = require("../service/authService");

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  await authService.registerUser(username, password);
  res.send("Register success");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await authService.loginUser(username, password);
  if (result.success) {
    res.json({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } else {
    res.send(result.message);
  }
});

module.exports = router;
