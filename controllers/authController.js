const jwt = require("jsonwebtoken");
const app = require("../app");

const User = require("../models/userModel");

// Simple pages handling
function signupController(req, res, next) {
  res.render("sign_up");
}

function signinController(req, res, next) {
  res.render("sign_in");
}

// Actual authorization
const userSignup = async function(req, res, next) {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    });

    // Create a JWT and save it in cookies
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    req.cookies.authToken = `Bearer ${token}`;

    // adding the details to the header to authenticate properly
    req.headers.authorization = `Bearer ${token}`;
    req.user = newUser;

    next();
  } catch (err) {
    console.log(err);
    res.status(500).render("404");
  }
};

const userSignin = async function(req, res, next) {
  try {
    // check if both the email and password are filled
    let { email, password } = req.body;

    if (!email || !password)
      return new Error("Please provide email and password");

    // check f user exists and password is correct
    // TO also get the fields that can not be selected use "+field_name"
    const user = await User.findOne({ email }).select("+password");
    // will return boolean

    if (!user || !(await user.correctPassword(password, user.password)))
      return next(res.status(401).render("404"));

    // 3) create token and then set it in the cookies
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    // ADD THE AUTHTOKEN TO COOKIES
    req.cookies.authToken = `Bearer ${token}`;

    // adding the details to the header to authenticate properly
    req.headers.authorization = `Bearer ${token}`;
    req.user = user;

    // console.log(req);
    // res.redirect(`/home/${user._id}`);

    next();

    // res.render("user-index", { books, name: user.name });
  } catch (err) {
    console.log(err);
    res.status(500).render("404");
  }
};

const userLogout = function(req, res, next) {
  req.cookies.authToken = "";
  res.redirect("/home");
};

module.exports = {
  signupController,
  signinController,
  userSignin,
  userSignup,
  userLogout,
};
