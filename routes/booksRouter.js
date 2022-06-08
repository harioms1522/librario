const Book = require("../models/bookModel");
const express = require("express");

const {
  getAllBooks,
  getBookById,
  createBook,
  updateBookById,
  deleteBookById,
  getBooksStats,
  getTop5Suggestions,
} = require("../controllers/booksController");

const router = express.Router();

router.route("/getBooksStats").get(getBooksStats);
router.route("/getTop5Suggestions").get(getTop5Suggestions);

router
  .route("/")
  .get(getAllBooks)
  .post(createBook);

router
  .route("/:id")
  .get(getBookById)
  .delete(deleteBookById)
  .patch(updateBookById);

module.exports = router;
