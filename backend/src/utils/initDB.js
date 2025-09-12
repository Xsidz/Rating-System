import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

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

  
  await createDefaultUsers();

  
  await createDefaultStoreAndRatings();

  return pool;
};


const createDefaultUsers = async () => {
  try {
    const defaultUsers = [
      {
        name: "Roxiler systems User",
        email: "Roxiller@user.com",
        password: "Roxiller@2025",
        address: "VCC Vantage 9, Pashan Hwy Side Rd, Baner, Pune, Maharashtra 411069",
        role: "user"
      },
      {
        name: "Roxiller Systems Store Owner",
        email: "Roxiller@store_Owner.com",
        password: "Roxiller@2025",
        address: "VCC Vantage 9, Pashan Hwy Side Rd, Baner, Pune, Maharashtra 411069",
        role: "store_owner"
      },
      {
        name: "Roxiller Systems System Admin",
        email: "Roxiller@admin.com",
        password: "Roxiller@2025",
        address: "VCC Vantage 9, Pashan Hwy Side Rd, Baner, Pune, Maharashtra 411069",
        role: "admin"
      }
    ];

    for (const user of defaultUsers) {
      
      const [existingUsers] = await pool.query(
        `SELECT id FROM users WHERE email = ?`,
        [user.email]
      );

      if (existingUsers.length === 0) {
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        
        await pool.query(
          `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`,
          [user.name, user.email, hashedPassword, user.address, user.role]
        );

        console.log(`Default ${user.role} user created: ${user.email}`);
      } else {
        console.log(`Default ${user.role} user already exists: ${user.email}`);
      }
    }
  } catch (error) {
    console.log("Error creating default users:", error.message);
  }
};


const createDefaultStoreAndRatings = async () => {
  try {
    
    const [storeOwner] = await pool.query(
      `SELECT id FROM users WHERE email = ?`,
      ['Roxiller@store_Owner.com']
    );
    
    const [user] = await pool.query(
      `SELECT id FROM users WHERE email = ?`,
      ['Roxiller@user.com']
    );

    if (storeOwner.length === 0 || user.length === 0) {
      console.log("Store owner or user not found, skipping store creation");
      return;
    }

    const storeOwnerId = storeOwner[0].id;
    const userId = user[0].id;

    
    const [existingStore] = await pool.query(
      `SELECT id FROM stores WHERE owner_id = ?`,
      [storeOwnerId]
    );

    let storeId;
    if (existingStore.length === 0) {
      
      const [storeResult] = await pool.query(
        `INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)`,
        [
          'Roxiller Systems Store',
          'Roxiller@store.com',
          'VCC Vantage 9, Pashan Hwy Side Rd, Baner, Pune, Maharashtra 411069',
          storeOwnerId
        ]
      );
      storeId = storeResult.insertId;
      console.log(`Default store created: Roxiller Systems Store (ID: ${storeId})`);
    } else {
      storeId = existingStore[0].id;
      console.log(`Default store already exists: Roxiller Systems Store (ID: ${storeId})`);
    }

    
    const [existingRatings] = await pool.query(
      `SELECT id FROM ratings WHERE user_id = ? AND store_id = ?`,
      [userId, storeId]
    );

    if (existingRatings.length === 0) {
      
      const sampleRatings = [
        { rating: 5, description: 'Excellent service and products!' },
        { rating: 4, description: 'Very good experience overall' },
        { rating: 5, description: 'Highly recommended store' }
      ];

      for (const ratingData of sampleRatings) {
        await pool.query(
          `INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)`,
          [userId, storeId, ratingData.rating]
        );
      }

      console.log(`Sample ratings created for store by user: ${sampleRatings.length} ratings`);
    } else {
      console.log(`Sample ratings already exist for this user-store combination`);
    }

  } catch (error) {
    console.log("Error creating default store and ratings:", error.message);
  }
};

export const getPool = ()=>{
    return pool;
}

