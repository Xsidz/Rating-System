import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
let pool;

export const initDB = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      multipleStatements: true
    });

    await pool.query(`select 1`);
    console.log("Connected to the existing DB", process.env.DB_NAME);
  } catch (err) {
    if (err.code == "ER_BAD_DB_ERROR") {
      console.log("Database Not Found. Creating One :", process.env.DB_NAME);

      const tempConn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      });

      await tempConn.query(
        `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
      );
      await tempConn.end();
      console.log("Databse Created Successfully");

      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        multipleStatements: true,
      });
    } else {
      console.log("DB connection Error ", err);
      process.exit(1);
    }
  }

  const schema = `

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  address TEXT(400),
  role ENUM('admin', 'user', 'store_owner') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS stores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  address TEXT(400) NOT NULL,
  owner_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  store_id INT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_store_rating (user_id, store_id)
);`;

  await pool.query(schema);

  console.log("Tables checked/created");

  return pool;
};

export const getPool = ()=>{
    return pool;
}

