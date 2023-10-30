const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./models/User");

const app = express();
const port = 3000;
const secretKey = "jwt_auth_example"; // Replace with a strong, random key

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "jwt_auth_example",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

app.use(bodyParser.json());

// Your routes for registration, login, and authentication will go here.
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      User.create(username, email, hashedPassword, (err) => {
        if (err) {
          res.status(500).json({ error: "Registration failed" });
        } else {
          res.status(201).json({ message: "Registration successful" });
        }
      });
    }
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  User.findByUsername(username, (err, user) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
    } else if (!user) {
      res.status(401).json({ error: "Authentication failed" });
    } else {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          res.status(500).json({ error: "Internal server error" });
        } else if (result) {
          const token = jwt.sign({ userId: user.id }, secretKey, {
            expiresIn: "1h",
          });
          res.status(200).json({ message: "Authentication successful", token });
        } else {
          res.status(401).json({ error: "Authentication failed" });
        }
      });
    }
  });
});

app.get("/users", (req, res) => {
  User.getAllUsers((err, response) => {
    if (err) throw err;
    res.send({
      message: "Users retrieved successfully",
      data: response,
    });
    console.log(response);
  });
});

// Route for logging out and invalidating the JWT token
app.post("/logout", (req, res) => {
  logout();
  res.status(200).json({ message: "Logout successful" });
});

// Handle the logout action on the client side
function logout() {
  localStorage.removeItem("token");

  window.location.href = "/login";
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
