const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "phatnv",
  password: "123456",
  database: "shopDEV",
});

// perform a sample operation
// pool.query("SELECT 1+1 AS SOLUTION", (err, result) => {
pool.query("SELECT * from users", (err, result) => {
  if (err) throw err;
  console.log("🚀 ~ pool.query ~ result:", result);

  pool.end((err) => {
    if (err) throw err;
    console.log("🚀 ~ Connection close");
  });
});
