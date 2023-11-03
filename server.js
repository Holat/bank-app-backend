const express = require("express");
const app = express();

app.get("/", (req, res) => {
  console.log("here");
  res.send("You entered this port already");
});

app.listen(3000, () => {
  console.log("Connected to port 3000");
});
