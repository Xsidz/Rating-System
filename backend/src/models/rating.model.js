import { getPool } from "../utils/initDB.js";



export const addRating = async (user_id, store_id, rating) => {
  const pool = getPool();
  const [result] = await pool.query(
    `INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)`,
    [user_id, store_id, rating]
  );
  return result.insertId;
};


export const updateRating = async (rating_id, user_id, rating) => {
  const pool = getPool();
  const [result] = await pool.query(
    `UPDATE ratings SET rating = ? WHERE id = ? AND user_id = ?`,
    [rating, rating_id, user_id]
  );
  return result.affectedRows;
};


export const getStoreRatings = async (store_id) => {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT r.id, r.rating, r.created_at, r.updated_at,
            u.id AS user_id, u.name AS user_name, u.email AS user_email
     FROM ratings r
     JOIN users u ON r.user_id = u.id
     WHERE r.store_id = ?`,
    [store_id]
  );
  return rows;
};

export const getStoreAverageRating = async (storeId) => {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT COALESCE(AVG(rating), 0) AS avgRating
     FROM ratings
     WHERE store_id = ?`,
    [storeId]
  );
  return rows[0].avgRating;
};
