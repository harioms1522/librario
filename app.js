const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");

/////////////////////////////////////////////////////
// controllers
const homePageController = require("./controllers/homePageController");

const {
  adminPanelHomePageController,
} = require("./controllers/adminPannelController");

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

// Routers
const booksRouter = require("./routes/booksRouter");
const usersRouter = require("./routes/userRouter");

const { createTransaction } = require("./controllers/transactionController");

// App to be used for routing
const app = express();

/////////////////////////////////////////////////////////
// allowing CORS
// only then I will be able to call the apis from client side
const cors = require("cors");
app.use(cors());

// COOKIE PARSER MIDDLEWARE
app.use(cookieParser());

// allowing app to use public files static files
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/img", express.static(__dirname + "/public/img"));
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/public", express.static(__dirname + "/public"));

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

// Rendering PAGE FOR ADMIN BOOKS MANAGEMENT
app.route("/admin-panel").get(adminPanelHomePageController);

// //////////////////////////////////////////////////////////
// Will change these to API calls only
// authorisation and actual user creation and login
app.route("/auth/signin").post(userSignin, verifyUser, userHomePageController);
app.route("/auth/signup").post(userSignup, userHomePageController);
app.route("/auth/logout").get(userLogout);

// protected route for just a user
// app.route("/home/book-gallery").get(userBookGalleryController);

// Books API
app.use("/api/v1/books", booksRouter);
app.use("/api/v1/users", usersRouter);
app.route("/transaction").post(createTransaction);

module.exports = app;
