const Book = require("../models/bookModel");
const express = require("express");

const {
  getAllBooks,
  getBookById,
  createBook,
  updateBookById,
  deleteBookById,
  getBookStats,
  top5Suggestions,
} = require("../controllers/booksController");

const router = express.Router();

router
  .route("/")
  .get(getAllBooks)
  .patch(createBook);

router
  .route("/:id")
  .get(getBookById)
  .delete(deleteBookById)
  .patch(updateBookById);

module.exports = router;
