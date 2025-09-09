import { getPool } from "../utils/initDB";

export const requireAuth = (role)=>{
    // checks if the user is logged in abd has a particular role
    return async (req,res,next) =>{
        console.log("Auth Middleware")
        const token = req.cookies.jwt;
        if(!token) return res.status(401).json({message :"Not logged in Please Log in!!"})
        
        try {
            // check if cookie token is valid 
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const pool = getPool()
            const [rows] = await pool.query(`SELECT id,name,email,role FROM users WHERE id = ?`,[decoded.userId])
            if (rows.length === 0) {
                 console.log("User not found in DB");
                return res.status(404).json({ message: "User not found" });
            }

            if(role && rows[0].role != role){
                return res.status(403).json({message : "Forbiddenn"})
            }

            req.user = rows[0];

            console.log("AUth check Done !!")
          
        } catch (error) {
            
        }
    }
}