$(function() {
  $.get("http://127.0.0.1:8000/api/v1/books", function(data, status) {
    const booksObj = [...data.data.books];

    $("#main-table").DataTable({
      data: booksObj,
      columns: [
        { data: "name" },
        { data: "assignedTo" },
        { data: "price" },
        { data: "category" },
        { data: "summary" },
        { data: "reviews" },
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
    $("#stats-table-per-user-books").DataTable({
      data: userBookInfo,
      columns: [{ data: "name" }, { data: "email" }, { data: "count" }],
    });
  });
});
