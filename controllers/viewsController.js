const Book = require("../models/bookModel");

const homePageController = async function(req, res, next) {
  const books = await Book.find();
  // console.log(books);

  res.render("index", { books });
};

function adminPanelHomePageController(req, res, next) {
  res.redirect("/public/admin-panel.html"); //HOW TO SEND THIS FIL)E // I set up a static route for this and the redirected it there see app file
}

function signupController(req, res, next) {
  res.render("sign_up");
}

function signinController(req, res, next) {
  res.render("sign_in");
}

module.exports = {
  homePageController,
  adminPanelHomePageController,
  signinController,
  signupController,
};
