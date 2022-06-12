const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");

/////////////////////////////////////////////////////
// controllers

const {
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
const viewsRouter = require("./routes/viewRouter");

const { createTransaction } = require("./controllers/transactionController");

// App to be used for routing
const app = express();

/////////////////////////////////////////////////////////
// allowing CORS
// only then I will be able to call the apis from client side because I am starting the front-end with the live server
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

//////////////////////////////////////////////////
//middlewares
app.use(morgan("dev"));
// body parser
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

///////////////////////////////////////////////
// Views Routing
//////////////////////////////////////////////

// for website pages
app.use("/", viewsRouter);

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
app.route("api/v1/transaction").post(createTransaction);

// AUTH API
app.route("/api/v1/sign-up").post(userSignup);
app.route("/api/v1/sign-in").post(userSignin);

module.exports = app;
