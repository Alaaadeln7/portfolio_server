require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const { SUCCESS, FAILD, ERROR } = require("./utils/httpStatusText");
// to solved prodlem cors in browser
const cors = require("cors");

// start mongoose section

const mongoose = require("mongoose");
const url = process.env.DATABASE_URL;
mongoose.connect(url).then(() => {
  console.log("mongoDB connected successfuly");
});
// end mongoose section

app.use(express.static(path.join(__dirname, "images")));
// start of static midelware

//end of static midelware
app.use(express.json());
app.use(cors());
const productsRouter = require("./routes/products.route");
const usersRouter = require("./routes/users.route");
const uploadRouter = require("./routes/upload");
app.use("/api/products", productsRouter);

app.use("/api/users", usersRouter);

app.use("/api/upload", uploadRouter);

// end use static upload folder

app.all("*", (req, res, next) => {
  return res
    .status(404)
    .json({ status: ERROR, message: "this resource is not available" });
});

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.listen(process.env.PORT || 4000, () => {
  console.log("app run in http://localhost:" + process.env.PORT);
});
