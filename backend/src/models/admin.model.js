import { getPool } from "../utils/initDB.js"
import bcrypt from "bcryptjs";

export const addUser= async (name, email,password,address,role)=>{
    const pool = getPool();
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password,salt);

    const [result] = await pool.query(`INSERT INTO users (name,email,password,address,role) VALUES(?,?,?,?,?)`, [name,email,hashPass,address,role])

    return result.insertId;
}

export const addStore = async(name,email,address,owner_id = null )=>{
    const pool = getPool()

    const [result] = pool.query(`INSERT INTO stores(name,email,adress,owner_id)`)
     return result.insertId;
}


export const getDashboardStats = async ()=>{
    const pool = getPool();

    const [userCount] = await pool.query(`SELECT COUNT(*) AS totalUsers from users`)
    const [storeCount] = await pool.query(`SELECT COUNT(*) AS totalStores FROM stores`)
    const [ratingCount] = await pool.query(`SELECT COUNT(*) AS totalRatings FROM ratings`)

    return {
        totalUsers : userCount[0].totalUsers,
        totalStores : storeCount[0].totalStores,
        totalRatings : ratingCount[0].totalRatings,
    }

}

export const getAllUsers = async (filters = {}) => {
  const pool = getPool();
  let baseQuery = `SELECT id, name, email, address, role FROM users WHERE 1=1`;
  const values = [];

  // add queries conditionally to filter accordingly
  if (filters.name) {
    baseQuery += " AND name LIKE ?";
    values.push(`%${filters.name}%`);
  }
  if (filters.email) {
    baseQuery += " AND email LIKE ?";
    values.push(`%${filters.email}%`);
  }
  if (filters.address) {
    baseQuery += " AND address LIKE ?";
    values.push(`%${filters.address}%`);
  }
  if (filters.role) {
    baseQuery += " AND role = ?";
    values.push(filters.role);
  }

  // we add the conditional query and values to perform query
  const [rows] = await pool.query(baseQuery, values);
  return rows;
};

export const getAllStores = async (filters = {}) => {
  const pool = getPool();
  let baseQuery = `
    SELECT s.id, s.name, s.email, s.address, 
           COALESCE(AVG(r.rating), 0) AS avgRating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE 1=1
  `;
  const values = [];

  // Apply filters dynamically
  if (filters.name) {
    baseQuery += " AND s.name LIKE ?";
    values.push(`%${filters.name}%`);
  }
  if (filters.email) {
    baseQuery += " AND s.email LIKE ?";
    values.push(`%${filters.email}%`);
  }
  if (filters.address) {
    baseQuery += " AND s.address LIKE ?";
    values.push(`%${filters.address}%`);
  }

  // used this to group the store as we have used avg to average ratings 
  baseQuery += " GROUP BY s.id"; 

  const [rows] = await pool.query(baseQuery, values);
  return rows;
};

export const getUserDetails = async (userId) => {
  const pool = getPool();

  
  const [rows] = await pool.query(
    `SELECT id, name, email, address, role FROM users WHERE id = ?`,
    [userId]
  );

  if (rows.length === 0) return null;

  const user = rows[0];

// If user is owner then show rating also 
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