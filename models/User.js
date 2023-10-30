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
    "INSERT INTO users SET ?",
    { username: username, email: email, password: password },
    (req, res) => {
      if (req) console.log(req);
      console.log(res);
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

User.getAllUsers = () => {
  db.query("SELECT * FROM users", (req, res) => {
    return res;
    // .send({
    //   message: "users retrieved successfully",
    //   data: res,
    // });
  });
};

module.exports = User;
