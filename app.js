const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");

// controllers
const homePageController = require("./controllers/homePageController");
const { userBookGalleryController } = require("./controllers/booksController");
const {
  signupController,
  signinController,
  userSignin,
  userSignup,
  userLogout,
} = require("./controllers/authController");
const {
  userHomePageController,
  verifyUser,
} = require("./controllers/userHomePageController");

// App to be used for routing
const app = express();
// COOKIE PARSER MIDDLEWARE
app.use(cookieParser());

// allowing app to use public files static files
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/img", express.static(__dirname + "/public/img"));
app.use("/js", express.static(__dirname + "/public/js"));

// view-engines
app.set("view engine", "ejs");

//middlewares
app.use(morgan("dev"));

// body parser
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
// for website pages
app.route("/home").get(homePageController);
// important only visible after signin or signup
app.route("/signup").get(signupController);
app.route("/signin").get(signinController);

// authorisation and actual user creation and login
app.route("/auth/signin").post(userSignin, verifyUser, userHomePageController);
app.route("/auth/signup").post(userSignup, userHomePageController);
app.route("/auth/logout").get(userLogout);

// protected route for just a user
app.route("/home/book-gallery").get(userBookGalleryController);

module.exports = app;
