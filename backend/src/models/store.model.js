import { getPool } from "../utils/initDB.js";

export const addStore = async ({ name, email, address, owner_id = null }) => {
  const pool = getPool();

  const [result] = await pool.query(
    `INSERT INTO stores(name, email, address, owner_id) VALUES (?, ?, ?, ?)`,
    [name, email, address, owner_id]
  );

  return result.insertId;
};




export const getAllStores = async (filters = {}) => {
  const pool = getPool();
  let baseQuery = `
    SELECT s.id, s.name, s.email, s.owner_id, s.address, 
           COALESCE(AVG(r.rating), 0) AS avgRating,
           COUNT(r.id) AS totalRatings
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE 1=1
  `;
  const values = [];


  if (filters.name) {
    baseQuery += " AND s.name LIKE ?";
    values.push(`%${filters.name}%`);
  }

  if (filters.address) {
    baseQuery += " AND s.address LIKE ?";
    values.push(`%${filters.address}%`);
  }


  baseQuery += " GROUP BY s.id";


  if (filters.minRating) {
    baseQuery += " HAVING avgRating >= ?";
    values.push(filters.minRating);
  }

  const allowedSortFields = ["name", "address", "avgRating"];
  const sortBy = allowedSortFields.includes(filters.sortBy)
    ? filters.sortBy
    : "avgRating";
  const sortOrder = filters.sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC";

  baseQuery += ` ORDER BY ${sortBy} ${sortOrder}`;

  const [rows] = await pool.query(baseQuery, values);
  return rows;
};

export const getStoreById = async (id) => {
  const pool = getPool();
  const [rows] = await pool.query(
    "SELECT id, name, email, address, owner_id FROM stores WHERE id = ?",
    [id]
  );
  return rows[0] || null;
};