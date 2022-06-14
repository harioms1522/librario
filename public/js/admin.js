$(function() {
  // Utility functions

  // to format the row to be included using the button in the assigned to
  function format(d) {
    // `d` is the original data object for the row
    return (
      '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
      "<tr>" +
      "<td>Full name:</td>" +
      "<td>" +
      d.name +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td>Extension number:</td>" +
      "<td>" +
      d.extn +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td>Extra info:</td>" +
      "<td>And any further details here (images etc)...</td>" +
      "</tr>" +
      "</table>"
    );
  }

  $.get("http://127.0.0.1:8000/api/v1/books", function(data, status) {
    const booksObj = [...data.data];

    // /////////////////////////////////
    // TEMPLATE ACCORDING TO THE  DATA RECEIVED
    // create an html and add that into the table container to be selected in the next stage
    // ////////////////////////////////////////////////

    let table = $("#main-table").DataTable({
      // Data
      data: booksObj,

      // length menu options
      lengthMenu: [
        [5, 10, 25, 50, -1],
        [5, 10, 25, 50, "All"],
      ],

      // implementing search only when enter key to search
      search: {
        return: true,
      },

      // Showing the row in highlighted form when there is the price above a certain value
      // if book is assigned to more than or equal to 3 people this should be highlighted
      createdRow: function(row, data, index) {
        // console.log(data);
        if (data.assignedTo.length >= 3) {
          $(row).css("background-color", "#80ed99");
          // $(row).addClass("highlighted-row");
        }
      },

      // DOM POSITIONING
      dom: "lft<'table-foot'ip>",

      // After the tables is rendered
      fnDrawCallback: function(settings) {
        // Deleting a book using the API
        $(".delete-book-btn").on("click", function(e) {
          const bookId = $(this).attr("data");
          $.ajax({
            url: `http://127.0.0.1:8000/api/v1/books/${bookId}`,
            method: "DELETE",
          })
            .done((msg) => alert("This book is deleted"))
            .fail((errMsg) => alert("This book doesn't existss"));
        });
      },

      // Columns configuration with the use of render to get the desired formatting
      columns: [
        { data: "name" },
        {
          data: "assignedTo",
          render: function(data, type, row) {
            return row.assignedTo.length;
          },
        },

        // { data: "assignedTo" },
        // adding a radio button that will show the rows below to show the info about the user
        // {
        //   data: "assignedTo",
        //   render: function(data, type, row) {
        //     return '<input type="radio" id="users-toggle" name="Users" value="visible"></input>';
        //   },
        // },

        {
          className: "dt-control",
          orderable: false,
          data: null,
          defaultContent: "",
        },
        { data: "author" },

        {
          data: "price",
          // To make it not searchable
          searchable: false,
        },
        { data: "category" },
        {
          data: "summary",
          render: function(data, type, row) {
            if (type == "display" && data.length > 40) {
              return (
                `<span class='imp-text'}>` + data.substr(0, 40) + "...</span>"
              );
            }
            return data;
          },
        },
        { data: "reviews" },
        {
          data: "createdAt",
          render: function(data, type, now) {
            const date = new Date(data).toDateString();
            if (type == "display" || type == "filter") {
              // console.log(date);
              return `${date}`;
            }
            return data;
          },
        },
        {
          render: function(data, type, row) {
            if (type == "display") {
              return `<a class='delete-book-btn' data='${row._id}' style='text-decoration:none'>DELETE</a>`;
            }
          },
        },
      ],
    });

    // Add the event listener for the additional info of the user added as a table
    $("#main-table tbody").on("click", "td.dt-control", function() {
      // console.log("HERE");
      let tr = $(this).closest("tr");

      const subTable =
        "<table class='sub-table'><thead><tr><th>Name</th><th>Email</th></tr></thead></table>";
      let row = table.row(tr);

      // console.log(row.data().user);

      if (row.child.isShown()) {
        // This row is already open - close it
        row.child.hide();
        tr.removeClass("shown");
      } else {
        // Open this row
        row.child(subTable).show();

        // create the data-table for this added html
        $(".sub-table").DataTable({
          data: row.data().user,
          dom: "t",
          columns: [{ data: "name" }, { data: "email" }],
        });
        // row.child(format(row.data())).show();
        tr.addClass("shown");
      }
    });
  });

  // /////////////////////////////////////////////////////////////////
  // for stats tables onlu one API call using facets is okay

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

      //DOM Structure of the table components
      dom: "<'table-stats-1'i<'table't>p>",

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
      dom: "tp",
      columns: [{ data: "name" }, { data: "email" }, { data: "count" }],

      // using footer callback to add all the count
      footerCallback: function(tfoot, data, start, end, display) {
        console.log(data);
        const api = this.api();

        // calculating total using API feature of the DataTables
        const totalAssignments = api
          .column(2)
          .data()
          .reduce((a, b) => a + b, 0);
        $(api.column(2).footer()).html(`TotalAssignments: ${totalAssignments}`);
      },
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

  // /////////////////////////////////////////////////////
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
