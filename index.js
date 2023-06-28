const express = require("express");
const app = express();
const path = require("path");
const { initDb } = require("./db");
const userController = require("./user/controller/userController");
const authController = require("./auth/controller/authController");
const { authenticate, authorize } = require("./authMiddleware");

initDb();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/usr", userController);
app.use("/", authController);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main.html"));
});

app.get("/loginPage", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/registerPage", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get(
  "/manageUsersPage",
  authenticate,
  authorize("administrator"),
  (req, res) => {
    res.sendFile(path.join(__dirname, "public", "manage_users.html"));
  }
);

app.listen(3000, () => {
  console.log("Server listening on port http://localhost:3000");
});
