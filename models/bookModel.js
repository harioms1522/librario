const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  createdAt: { type: Date, default: new Date(), required: true },

  name: {
    type: String,
    required: [true, "Name is must!"],
  },

  isbn: {
    type: String,
    unique: [true, "Field must be unique"],
    required: [true, "ISBN is must!"],
  },

  // I will define all the categories in the end
  category: {
    type: String,
    enum: ["type1", "type2"],
    required: [true, "Category is required"],
  },

  author: String,

  summary: String,

  reviews: [String],

  assignedTo: [String],

  img: String,
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
