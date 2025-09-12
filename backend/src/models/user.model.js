import { getPool } from "../utils/initDB.js";
import bcrypt from "bcryptjs";

export const addUser = async (name, email, password, address, role) => {
  const pool = getPool();
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(password, salt);

  const [result] = await pool.query(
    `INSERT INTO users (name,email,password,address,role) VALUES(?,?,?,?,?)`,
    [name, email, hashPass, address, role]
  );

  return result.insertId;
};

export const getAllUsers = async (filters = {}) => {
  const pool = getPool();
  let baseQuery = `
    SELECT u.id, u.name, u.email, u.address, u.role,
           CASE 
             WHEN u.role = 'store_owner' THEN COALESCE(AVG(r.rating), 0)
             ELSE NULL
           END AS averageRating,
           CASE 
             WHEN u.role = 'store_owner' THEN COUNT(r.id)
             ELSE NULL
           END AS totalRatings
    FROM users u
    LEFT JOIN stores s ON u.id = s.owner_id AND u.role = 'store_owner'
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE 1=1
  `;
  const values = [];


  if (filters.name) {
    baseQuery += " AND u.name LIKE ?";
    values.push(`%${filters.name}%`);
  }
  if (filters.email) {
    baseQuery += " AND u.email LIKE ?";
    values.push(`%${filters.email}%`);
  }
  if (filters.address) {
    baseQuery += " AND u.address LIKE ?";
    values.push(`%${filters.address}%`);
  }
  if (filters.role) {
    baseQuery += " AND u.role = ?";
    values.push(filters.role);
  }

  baseQuery += " GROUP BY u.id, u.name, u.email, u.address, u.role";

  const [rows] = await pool.query(baseQuery, values);

  
  return rows.map(user => ({
    ...user,
    averageRating: user.averageRating ? parseFloat(user.averageRating) : null,
    totalRatings: user.totalRatings ? parseInt(user.totalRatings) : null
  }));
};

export const getUserDetails = async (userId) => {
  const pool = getPool();

  const [rows] = await pool.query(
    `SELECT id, name, email, address, role FROM users WHERE id = ?`,
    [userId]
  );

  if (rows.length === 0) return null;

  const user = rows[0];


  if (user.role === "store_owner") {
    const [[storeData]] = await pool.query(
      `
      SELECT AVG(r.rating) AS avgRating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.owner_id = ?
    `,
      [userId]
    );
    user.avgRating = storeData.avgRating || 0;
  }

  return user;
};
