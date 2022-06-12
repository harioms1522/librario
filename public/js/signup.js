// const axios = require("axios");
// I will see if we can get it from npm
$(function() {
  $("#signup-submit").on("click", function(e) {
    e.preventDefault();
    const name = $("#name").val();
    const email = $("#email").val();
    const password = $("#password").val();
    const confirmPassword = $("#confirmPassword").val();
    const data = { name, email, password, confirmPassword };
    axios.post("http://127.0.0.1:8000/api/v1/sign-up", data).then((res) => {
      console.log(res);
    });
  });
});
