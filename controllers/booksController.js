const Book = require("../models/bookModel");
// User information who is using this API will come in the cookies transferred
// which will then be passed in the req

// For API
const getAllBooks = async function(req, res, next) {
  try {
    // This is the query
    let books = Book.find();

    /////////////////////////////////////////////////
    // Filtering

    // get the query string object
    const queryObj = { ...req.query };

    // Handling filter according to the field values
    //  We want to exclude certain fields
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((curr) => delete queryObj[curr]);

    //implementing for the gte lte lt and gt features
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);
    // console.log(queryStr);

    ////////////////////////////////////////////////////
    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      books = books.sort(sortBy);
    } else {
      books = books.sort("-createdAt");
    }

    // //////////////////////////////////////////////
    // fields selection
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      books = books.select(fields);
    } else {
      books = books.select("-__v");
    }

    ////////////////////////////////////////////////////
    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;

    // console.log(limit);

    books = books.skip(skip).limit(limit);

    // just await it in the end
    books = await books.find(JSON.parse(queryStr));

    res.status(200).json({
      status: "Success",
      data: {
        books,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "Failure", error: { err } });
  }
};

const getBookById = async function(req, res, next) {
  try {
    const id = req.params.id;
    // console.log(id);
    const books = await Book.find({ _id: id });
    res.status(200).json({
      status: "Success",
      data: {
        books,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "Failure", error: { err } });
  }
};

const createBook = async function(req, res, next) {
  try {
    console.log(req.body);
    const book = await Book.create(req.body);
    res.status(200).json({
      status: "Success",
      data: {
        book,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "Failure", error: { err } });
  }
};

const updateBookById = async function(req, res, next) {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return new Error("No book found with this Id");
    }

    // console.log(book);
    res.status(200).json({
      status: "success",
      data: {
        book,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "Failure", error: { err } });
  }
};

const deleteBookById = async function(req, res, next) {
  const book = await Book.findByIdAndDelete(req.params.id);

  if (!book) {
    return new Error("No tour found with that ID");
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
};

const getBooksStats = async function(req, res, next) {
  try {
    const stats = await Book.aggregate([
      {
        $facet: {
          booksCountByUser: [
            { $unwind: "$assignedTo" },
            // { $sortByCount: "$name" },
            { $group: { _id: "$name", count: { $sum: 1 } } },
          ],
          booksCountByCategory: [{ $sortByCount: "$category" }],
          perUserBooks: [
            { $unwind: "$assignedTo" },
            {
              $addFields: {
                objIdAssignedTo: { $toObjectId: "$assignedTo" },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "objIdAssignedTo",
                foreignField: "_id",
                as: "user",
              },
            },
            { $sortByCount: "$user" },
          ],
          totalReviews: [
            { $unwind: "$reviews" },
            { $group: { _id: "$name", count: { $sum: 1 } } },
            { $sort: { count: 1 } },
          ],
        },
      },
    ]);

    res.status(200).json({
      status: "Success",
      data: { stats },
    });
  } catch (err) {
    res.status(404).json({ status: "Failure", error: { err } });
  }
};

const getTop5Suggestions = async function(req, res, next) {
  try {
    const top5 = await Book.aggregate([
      { $unwind: "$reviews" },
      { $group: { _id: "$_id", count: { $sum: 1 } } },
      { $sort: { count: 1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      status: "Success",
      data: { top5 },
    });
  } catch (err) {
    res.status(404).json({ status: "Failure", error: { err } });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById,
  getBooksStats,
  getTop5Suggestions,
  createBook,
};
