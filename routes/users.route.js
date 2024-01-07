const express = require("express");

const router = express.Router();

// import controllers
const {
  getAllUsers,
  getSingleUser,
  register,
  login,
  logout,
} = require("../controllers/users.controller");

router.route("/").get(getAllUsers);

router.route("/:userId").get(getSingleUser).delete(logout);

router.route("/register").post(register);

router.route("/login").post(login);

module.exports = router;
