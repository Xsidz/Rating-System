import bcrypt from "bcryptjs";
import { getPool } from "../utils/initDB.js";
import { gennToken } from "../utils/lib.js";
export const signUp = async (req, res) => {
  const { Name, Email, Password, Address } = req.body;
  try {
    if (!Name || !Email || !Password || !Address) {
      return res.status(400).json({ message: "All fields are required !! " });
    }
    if (Password.lenght < 6) {
      return res
        .status(400)
        .json({ message: "Password Length Should be atleast 6 Characters" });
    }
    const pool = getPool();
    const [existingUser] = await pool.query(
      `SELECT * FROM users WHERE email = ?`,
      [Email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(Password, salt);

    const [result] = await pool.query(
      `INSERT INTO users(name, email,password,address,role) VALUES(?,?,?,?,'user')`,
      [Name, Email, hashedPass, Address]
    );

    console.log(result);

    const [rows] = await pool.query(
      `SELECT id,name, email, address, role, created_at,updated_at FROM users WHERE id = ?`, [result.insertId]
    );

    const newUser = rows[0];
    console.log(newUser.id)

    gennToken(newUser.id, res);

    return res.status(200).json(newUser);
  } catch (error) {
    console.log("Error in the Signup controller :", error.message);
    return res.status(500).json({ message: "Internal Server Error!!" });
  }
};
export const logIn = async(req, res) => {
  const { Email, Password } = req.body;
  try {
    if (!Email || !Password) {
      return res.status(400).json({ message: "All fields are required!!" });
    }
    const pool = getPool();
    const [row] = await pool.query(`SELECT * FROM users WHERE email = ?`, [
      Email,
    ]);

    console.log(row);
    const user = row[0];
    if (!user) {
      return res.status(400).json({ message: "Inavlid Credentials" });
    }
    const isPassCorrect = await bcrypt.compare(Password, user.password);
    if (!isPassCorrect) {
      return res.status(400).json({ message: "Inavlid Credentials" });
    }
    gennToken(user.id, res);

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  } catch (error) {
    console.log("Error in the Login controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const logOut = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });

    return res.status(200).json({ message: "LoggedOut Successfully" });
  } catch (error) {
    console.log("Error in the log out controller : ", error.message);
    return res.status(500).json({ message: " Internal Server Error" });
  }
};

export const updatePassword = async()=>{
    const{currentPassword, newPassword} = req.body;

    try {
        const pool = getPool()
        const [row] = await pool.query(`SELECT password FROM users WHERE id =?`,[req.user.id])
        if(row.lenght == 0) return res.status(404).json({message : "User not Found!!"})
        const user = row[0];
        const passwordMatch = await bcrypt.compare(currentPassword,user.password)
        if(!passwordMatch) return res.status(400).json({message : "Current password is incorrect!!"})
        const salt = await bcrypt.genSalt(10);
        const newHashed = await bcrypt.hash(newPassword,salt);

        await pool.query(`UPDATE users SET paswword = ? WHERE id = ?`,[newHashed,req.user.id])

        console.log("Password Updated");
        res.clearCookie("jwt");

        return res.status(200).json({message:"Password updated successfully. Please log in again"})

    } catch (error) {
        console.log("Error in the udpatePassword Controller : ", error.message)
        return res.status(500).json({message:"Internal Server Error"})
    }
}
export const checkAuth = (req, res) => {
  res.send("Welcome to the checkAuth Page");
};
