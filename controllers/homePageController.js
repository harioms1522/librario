// models import
const Book = require("../models/bookModel");

const homePageController = function(req, res, next) {
  console.log("Here");
  const books = [
    "/img/book-1.jpg",
    "/img/book-2.jpg",
    "/img/book-3.jpg",
    "/img/book-4.jpg",
  ];
  res.render("index", { books });
};

module.exports = homePageController;
