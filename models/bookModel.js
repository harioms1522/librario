const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is must!"],
  },
  isbn: {
    type: String,
    unique: [true, "Field must be unique"],
    required: [true, "ISBN is must!"],
  },
  author: String,
  summary: String,
  assignedTo: [String],
  img: String,
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
