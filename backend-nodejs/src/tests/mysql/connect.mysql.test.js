const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "phatnv",
  password: "123456",
  database: "shopDEV",
});

// perform a sample operation
// pool.query("SELECT 1+1 AS SOLUTION", (err, result) => {
// pool.query("SELECT * from users", (err, result) => {
//   if (err) throw err;
//   console.log("🚀 ~ pool.query ~ result:", result);

//   pool.end((err) => {
//     if (err) throw err;
//     console.log("🚀 ~ Connection close");
//   });
// });
// :: TIMER :::: 7.009s
// :: TIMER :::: 1:12.329 (m:ss.mmm)
const batchSize = 100_000;
const totalSize = 10_000_000;
let currentId = 1;
console.time(":: TIMER :::");
const insertBatch = async () => {
  const values = [];
  for (let index = 0; index < batchSize && currentId <= totalSize; index++) {
    const name = `name-${currentId}`;
    const age = currentId;
    const address = `address-${currentId}`;
    values.push([currentId, name, age, address]);
    currentId++;
  }
  if (!values.length) {
    console.timeEnd(":: TIMER :::");

    pool.end((err) => {
      if (err) console.log("error occurred while running batch");
      else console.log("Connection pool closed successfully");
    });
    return;
  }

  const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`;
  pool.query(sql, [values], async (err, results) => {
    if (err) throw err;
    console.log(`Inserted ${results.affectedRows} records`);
    // console.log("🚀 ~ pool.query ~ result:", results);
    await insertBatch();
  });
};
insertBatch().catch(console.error);
