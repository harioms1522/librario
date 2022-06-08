const mongoose = require("mongoose");

const bookTransaction = new mongoose.Schema({
  createdAt: { type: Date, default: new Date(), select: false },
  bookId: String,
  userId: String,
  transactionType: {
    type: String,
    enum: ["liked", "subscribed"],
    required: [true, "transaction type is required"],
  },
});

const Transaction = mongoose.model("Transaction", bookTransaction);

module.exports = { Transaction };
