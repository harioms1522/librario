const { promisify } = require("util");
const User = require("../models/userModel");
const Book = require("../models/bookModel");
const jwt = require("jsonwebtoken");

async function userHomePageController(req, res, next) {
  try {
    console.log("userhomepagecontroller");
    //   const userID = req.params.user;
    const userID = req.user._id;

    const user = await User.findOne({ _id: userID });

    // Getting Books assigned to this user
    const books = await Book.aggregate([
      { $unwind: "$assignedTo" },
      { $match: { assignedTo: { $eq: userID + "" } } },
    ]);
    // console.log(books);

    // let booksImgs = [];
    // books.forEach((book) => {
    //   booksImgs.push(book.img);
    // });

    // console.log(booksImgs);

    res.render("user-index", { books, name: user.name, userID });
  } catch (err) {
    console.log(err);
    res.status(500).render("404");
  }
}

/////////////////////////////////////////////////////////////////////
// VERIFY
// ////////////////////////////////////////////////////////////

async function verifyUser(req, res, next) {
  try {
    // checking the token
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log(token);
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      next(new Error("You are no authorized"));
    }

    //   console.log(token);

    // validate the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // checking if the user is still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) return next(new Error("Something went wrong"));

    // Check if user changed password after the token was issued
    req.user = freshUser;

    next();
  } catch (err) {
    console.log(err);
    res.status(500).render("404");
  }
}

module.exports = { userHomePageController, verifyUser };
