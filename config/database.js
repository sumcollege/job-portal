const mysql = require("mysql2")
require("dotenv").config()

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "job_portal",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
})

// Test database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message)
  } else {
    console.log("✅ Database connected successfully!")
    connection.release()
  }
})

module.exports = pool.promise()
