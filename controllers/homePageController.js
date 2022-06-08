// models import
const Book = require("../models/bookModel");

const homePageController = async function(req, res, next) {
  const books = await Book.find();
  console.log(books);

  res.render("index", { books });
};

module.exports = homePageController;
