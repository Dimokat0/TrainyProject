const express = require("express");
const router = express.Router();
const userService = require("../service/userService");
const userRepository = require("../repository/userRepository");

router.get("/", async (req, res) => {
  const users = await userRepository.getAllUsers();
  res.json(users);
});

router.get("/id", async (req, res) => {
  const { id } = req.params;
  const user = await userRepository.getUserById(id);
  res.json(user);
});

router.get("/roles", async (req, res) => {
  const roles = await userRepository.getRoles();
  res.json(roles);
});

router.get("/roles:id", async (req, res) => {
  const role = await userRepository.getRoleById(req.params);
  res.json(role);
});

router.post("/", async (req, res) => {
  const { username, password, roleId } = req.body;
  if (!roleId) {
    roleId = 1;
  }
  await userService.createUser(username, password, roleId);
  res.send("User created");
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { username, password, roleId } = req.body;
  await userRepository.updateUser(id, username, password, roleId);
  res.send("User updated");
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await userRepository.deleteUser(id);
  res.send("User deleted");
});

module.exports = router;
