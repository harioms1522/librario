const { Transaction } = require("../models/bookAssignmentsModel");

async function createTransaction(req, res, next) {
  try {
    const bookId = req.body.bookId;
    const userId = req.body.userId;
    const transactionType = req.body.transactionType;
    const transaction = await Transaction.create({
      bookId,
      userId,
      transactionType,
    });

    res.status(200).json({ status: "Successful", data: { transaction } });
  } catch (err) {
    res.status(404).json({ status: "Failure", error: { err } });
  }
}

async function subsScribeBook(req, res, next) {}

module.exports = { createTransaction };
