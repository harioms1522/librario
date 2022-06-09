const path = require("path");

function adminPanelHomePageController(req, res, next) {
  res.redirect("/public/index.html"); //HOW TO SEND THIS FIL)E // I set up a static route for this and the redirected it there see app file
}

module.exports = { adminPanelHomePageController };
