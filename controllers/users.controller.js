const asyncWrapper = require("../middleware/asyncWrapper");
const User = require("../models/user.model");
const { SUCCESS, FILAD, ERROR } = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const bcrypt = require("bcryptjs");

const getAllUsers = asyncWrapper(async (req, res) => {
  console.log(req.headers);
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);
  res.json({ status: SUCCESS, data: { users } });
});

const register = asyncWrapper(async (req, res, next) => {
  const { fristName, lastName, email, password } = await req.body;

  const oldUser = await User.findOne({ email: email });

  if (oldUser) {
    const error = appError.create("user already exist", 400, ERROR);
    return next(error);
  }

  const newUser = new User({
    fristName,
    lastName,
    email,
    password,
  });
  await newUser.save();
  res.status(201).json({ status: SUCCESS, data: { user: newUser } });
});

const getSingleUser = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    const error = appError.create("not found user", 404, ERROR);
    return next(error);
  }
  return res.json({ status: SUCCESS, data: { user } });
});

// login
const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && !password) {
    const error = appError.create(
      "email and password are required",
      400,
      FILAD
    );
    return next(error);
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    const error = appError.create("user is not found", 400, FILAD);
    return next(error);
  }
  const matchedPassword = await bcrypt.compare(password, user.password);

  if (user && matchedPassword) {
    res.json({ status: SUCCESS, data: { user } });
  } else {
    const error = appError.create("something wrong", 500, ERROR);
    return next(error);
  }
});
const logout = asyncWrapper(async (req, res) => {
  await User.deleteOne({ _id: req.params.userId });
  res.status(200).json({ status: SUCCESS, data: null });
});

module.exports = {
  getAllUsers,
  getSingleUser,
  register,
  login,
  logout,
};
