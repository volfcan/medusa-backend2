const axios = require("axios");

axios
  .post("http://localhost:7001/admin/auth", {
    email: "volcanbozkurt@gmail.com",
    password: "123",
  })
  .then((response) => {
    console.log(response.data.token);
  });
