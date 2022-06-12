const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Functions
const signToken = function(userID) {
  return jwt.sign({ id: userID }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

const generateTokeAndSend = function(res, statusCode, user) {
  const token = signToken(user._id);

  const cookieOptions = {
    expire: new Date(Date.now() + process.env.JWT_EXPIRY * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  // Send the token to cookies
  res.cookie("jwt", token, cookieOptions);

  // send the data for API
  res.status(statusCode).json({
    status: "Success",
    token,
    data: { user },
  });
};

///////////////////////////////////////////////////////
// Actual authorization

// SignUp
const userSignup = async function(req, res, next) {
  console.log("Here");
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    });

    // generate token and send through API
    generateTokeAndSend(res, 201, newUser);

    next();
  } catch (err) {
    console.log(err);
    res.status(500).render("404");
  }
};

////////////////////////////////////////////////////////////////
// SignIn

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

    generateTokeAndSend(res, 200, user);

    next();

    // res.render("user-index", { books, name: user.name });
  } catch (err) {
    console.log(err);
    res.status(500).render("404");
  }
};

const userLogout = function(req, res, next) {
  req.cookie("jwt", "loggedOut", {
    expire: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
};

//Middleware for protected routes
const protect = async function(req, res, next) {
  let token;
  // cecking if the token is passed in header or the cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) return new Error("No Token available");

  // Verify the token
  // jwt.verify is a call back based function so lets promisify that
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // get the current user
  const user = await User.find({ _id: decoded.id });
  if (!user) return new Error("No such user");

  // // was password changed after the token generation
  // if (user.changedPaswordAfter(decoded.iat))
  //   return new Error("Password was changed");

  req.user = user;
  res.locals.user = user;
};

// for rendered pages
// Only for rendered pages, no errors!
const isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // // 3) Check if user changed password after the token was issued
      // if (currentUser.changedPasswordAfter(decoded.iat)) {
      //   return next();
      // }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

module.exports = {
  userSignin,
  userSignup,
  userLogout,
  protect,
  isLoggedIn,
};
