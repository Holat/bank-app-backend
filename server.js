const express = require("express");
const mysql = require("mysql");
const bcryptjs = require("bcryptjs");

require("dotenv").config();

const app = express();

app.use(express.json());

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "users",
});

con.connect((err) => {
  if (err) {
    console.log("There was a problem connection");
  } else {
    console.log("Connection successful");
  }
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM bank_users WHERE email = ?";

  con.query(sql, [req.body.email], (err, result) => {
    if (err) {
      return res.json({ Status: "Error", Error: "Error in running query" });
    }

    if (result.length > 0) {
      bcryptjs.compare(
        req.body.password.toString(),
        result[0].password,
        (err, response) => {
          if (err) return res.json({ Error: "Password error" });
          if (response) {
            const { firstname, lastname, id, email, savings, current, other } =
              result[0];
            return res.json({
              Status: "Success",
              details: {
                firstname,
                lastname,
                id,
                email,
                savings,
                current,
                other,
              },
            });
          } else {
            return res.json({
              Status: "Error",
              Error: "Wrong Email or Password",
            });
          }
        }
      );
    } else {
      console.log(err);
      return res.json({ Status: "Error", Error: "Wrong Email or Password" });
    }
  });
});

app.post("/signup", (req, res) => {
  const sql =
    "INSERT INTO bank_users (`firstname`, `lastname`, `email`, `password`) VALUES (?)";

  bcryptjs.hash(req.body.password.toString(), 10, (err, hash) => {
    if (err) return res.json({ Error: "Error in hashing password" });

    const values = [
      req.body.firstname,
      req.body.lastname,
      req.body.email,
      hash,
    ];

    con.query(sql, [values], (err, result) => {
      if (err) return res.json({ Error: "Inside signup query" });
      return res.json({ Status: "Success", id: result.insertId });
    });
  });
});

app.get("/transaction/:id", (req, res) => {
  const id = req.params.id;

  const sql = "SELECT * FROM transactions WHERE  user_id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "Error in getting transaction" });
    return res.json({ Status: "Success", result });
  });
});

app.listen(process.env.PORT, process.env.HOST, (err) => {
  console.log("Connected to port 3000");
});
