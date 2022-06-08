const Book = require("../models/bookModel");

// For API
const getAllBooks = async function(req, res, next) {
  try {
    const books = await Book.find();
    res.status(200).json({
      status: "Success",
      data: {
        books,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

const getBookById = async function(req, res, next) {
  try {
    const id = req.params.id;
    console.log(id);
    const books = await Book.find({ _id: id });
    res.status(200).json({
      status: "Success",
      data: {
        books,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failure",
    });
  }
};

const createBook = async function(req, res, next) {};

const updateBookById = async function(req, res, next) {};

const deleteBookById = async function(req, res, next) {};

const getBookStats = async function(req, res, next) {};

const top5Suggestions = async function(req, res, next) {};

module.exports = {
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById,
  getBookStats,
  top5Suggestions,
  createBook,
};
