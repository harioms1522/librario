const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    //   createdAt: {
    //     type: Date,
    //     default: Date.now(),
    //     required: true,
    //   },

    name: {
      type: String,
      required: [true, "Name is must!"],
      unique: [true, "Name must be unique"],
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

    price: String,
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
