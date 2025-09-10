import { getPool } from "../utils/initDB";

export const addStore = async (name, email, address, owner_id = null) => {
  const pool = getPool();

  const [result] = pool.query(`INSERT INTO stores(name,email,adress,owner_id)`);
  return result.insertId;
};

export const getAllStores = async (filters = {}) => {
  const pool = getPool();
  let baseQuery = `
    SELECT s.id, s.name,  s.address, 
           COALESCE(AVG(r.rating), 0) AS avgRating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE 1=1
  `;
  const values = [];

  // Apply filters before aggregation
  if (filters.name) {
    baseQuery += " AND s.name LIKE ?";
    values.push(`%${filters.name}%`);
  }
 
  if (filters.address) {
    baseQuery += " AND s.address LIKE ?";
    values.push(`%${filters.address}%`);
  }

  // Group for AVG aggregation
  baseQuery += " GROUP BY s.id";

  // Apply rating filter after aggregation
  if (filters.minRating) {
    baseQuery += " HAVING avgRating >= ?";
    values.push(filters.minRating);
  }

  
  const allowedSortFields = ["name", "address", "avgRating"];
  const sortBy = allowedSortFields.includes(filters.sortBy)
    ? filters.sortBy
    : "avgRating"; 
  const sortOrder =
    filters.sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC"; 

  baseQuery += ` ORDER BY ${sortBy} ${sortOrder}`;

  const [rows] = await pool.query(baseQuery, values);
  return rows;
};


