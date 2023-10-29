// const db = require('../db');

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "jwt_auth_example",
});

const User = {};

User.create = (username, email, password, callback) => {
  db.query(
    "INSERT INTO users VALUES (?, ?, ?)",
    [username, email, password],
    (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    }
  );
};

User.findByUsername = (username, callback) => {
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(null, null);
      return callback(null, results[0]);
    }
  );
};

module.exports = User;
