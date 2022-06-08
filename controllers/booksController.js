const Book = require("../models/bookModel");

// For API
const getAllBooks = async function(req, res, next) {};

const updateBookById = async function(req, res, next) {};

const deleteBookById = async function(req, res, next) {};

const getBookStats = async function(req, res, next) {};

const top5Suggestions = async function(req, res, next) {};

// For Website
const userBookGalleryController = async function(req, res, next) {
  // Find the books for that user
  // render the user-index page with that new list of Books
};

module.exports = { userBookGalleryController };
