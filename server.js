import express from "express";
import mysql from "mysql";
import bcryptjs from "bcryptjs";
import cors from "cors";

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
            return res.json({ Status: "Success" });
          } else {
            return res.json({
              Status: "Error",
              Error: "Wrong Email or Password 0",
            });
          }
        }
      );
    } else {
      return res.json({ Status: "Error", Error: "Wrong Email or Password 1" });
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
      return res.json({ Status: "Success" });
    });
  });
});

// 10.0.2.16

app.get("/transaction/:id", (req, res) => {
  const id = req.params.id;

  const sql = "SELECT * FROM transactions WHERE  user_id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "Error in getting transaction" });
    return res.json({ Status: "Success", result });
  });
});

const hostname = "192.168.66.71";
app.listen(3000, hostname, (err) => {
  console.log("Connected to port 3000");
});
