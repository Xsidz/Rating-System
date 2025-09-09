import { getPool } from "../utils/initDB.js";
import jwt from "jsonwebtoken";

export const requireAuth = (roles=[])=>{
    // checks if the user is logged in abd has a particular role
    return async (req,res,next) =>{
        console.log("Auth Middleware")
        const token = req.cookies.jwt;
        if(!token) return res.status(401).json({message :"Not logged in Please Log in!!"})
        
        try {
            // get & check if cookie token is valid 
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const pool = getPool()
            const [rows] = await pool.query(`SELECT id,name,email,role FROM users WHERE id = ?`,[decoded.userId])
            if (rows.length === 0) {
                 console.log("User not found in DB");
                return res.status(404).json({ message: "User not found" });
            }

            if(roles.length && !roles.includes(rows[0].role)){
                return res.status(403).json({message : "Forbidden"})
            }

            req.user = rows[0];

            console.log("AUth check Done !!")
            next();
          
        } catch (error) {
            console.error("Auth Middleware Error:", error.message);
      return res.status(401).json({ message: "Invalid or expired token" });
        }
    }
}