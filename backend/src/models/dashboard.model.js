import { getPool } from "../utils/initDB.js"

export const getDashboardStats = async ()=>{
    const pool = getPool()

    const [userCount] = await pool.query(`SELECT COUNT(*) AS totalUsers from users`)
    const [storeCount] = await pool.query(`SELECT COUNT(*) AS totalStores FROM stores`)
    const [ratingCount] = await pool.query(`SELECT COUNT(*) AS totalRatings FROM ratings`)

    return {
        totalUsers : userCount[0].totalUsers,
        totalStores : storeCount[0].totalStores,
        totalRatings : ratingCount[0].totalRatings,
    }

}