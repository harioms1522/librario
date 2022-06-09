$(function() {
  $.get("http://127.0.0.1:8000/api/v1/books", function(data, status) {
    const booksObj = [...data.data.books];

    // /////////////////////////////////
    // TEMPLATE ACCORDING TO THE  DATA RECEIVED
    // create an html and add that into the table container to be selected in the next stage
    // ////////////////////////////////////////////////

    $("#main-table").DataTable({
      data: booksObj,
      columns: [
        { data: "name" },
        { data: "assignedTo" },
        { data: "price" },
        { data: "category" },
        { data: "summary" },
        { data: "reviews" },
        { data: "createdAt" },
      ],
    });

    // html = ejs.render('<%= people.join(", "); %>', { books: data.data });
  });

  $.get("http://127.0.0.1:8000/api/v1/books/getBooksStats", function(
    data,
    status
  ) {
    const booksCountByUser = [...data.data.stats[0].booksCountByUser];
    // console.log(booksCountByUser);
    // /////////////////////////////////
    // TEMPLATE ACCORDING TO THE  DATA RECEIVED
    // create an html and add that into the table container to be selected in the nect stage
    // ////////////////////////////////////////////////

    $("#stats-table-book-count-by-user").DataTable({
      data: booksCountByUser,
      columns: [{ data: "_id" }, { data: "count" }],
    });

    // ////////////////////////////
    // Second stats report
    const booksPerUser = [...data.data.stats[0].perUserBooks];
    const userBookInfo = [];

    booksPerUser.forEach((curr) => {
      userBookInfo.push({
        name: curr._id[0].name,
        email: curr._id[0].email,
        count: curr.count,
      });
    });

    // /////////////////////////////////
    // TEMPLATE ACCORDING TO THE  DATA RECEIVED
    // create an html and add that into the table container to be selected in the nect stage
    // ////////////////////////////////////////////////

    $("#stats-table-per-user-books").DataTable({
      data: userBookInfo,
      columns: [{ data: "name" }, { data: "email" }, { data: "count" }],
    });

    // //////////////////////
    // Third stats report
    const reviewsPerBook = [...data.data.stats[0].totalReviews];

    // /////////////////////////////////
    // TEMPLATE ACCORDING TO THE  DATA RECEIVED
    // create an html and add that into the table container to be selected in the nect stage
    // ////////////////////////////////////////////////

    $("#stats-table-review-count-per-book").DataTable({
      data: reviewsPerBook,
      columns: [{ data: "_id" }, { data: "count" }],
    });

    // /////////////////////////
    // Fourth Report
    const booksCountByCategory = [...data.data.stats[0].booksCountByCategory];

    // /////////////////////////////////
    // TEMPLATE ACCORDING TO THE  DATA RECEIVED
    // create an html and add that into the table container to be selected in the nect stage
    // ////////////////////////////////////////////////

    $("#stats-table-books-count-by-category").DataTable({
      data: booksCountByCategory,
      columns: [{ data: "_id" }, { data: "count" }],
    });
  });

  // book creation form
  $("#book-creation-form").on("submit", (e) => {
    e.preventDefault();
    // How to get form data to add that in body as Json or
    // try {
    //   $.post(
    //     "http://127.0.0.1:8000/api/v1/books",
    //     $("#book-creation-form").serialize(),
    //     function(data, status) {
    //       alert(status);
    //     }
    //   );
    // } catch (err) {
    //   alert(err);
    // }

    $.ajax({
      url: "http://127.0.0.1:8000/api/v1/books",
      method: "POST",
      data: $("#book-creation-form").serialize(),
    })
      .done(function(msg) {
        alert(msg);
      })
      .fail(function(_, msg) {
        alert("Request failed: " + msg);
      });
  });
});
