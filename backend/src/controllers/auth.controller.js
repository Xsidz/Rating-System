import bcrypt from "bcryptjs";
import { getPool } from "../utils/initDB.js";
import { gennToken } from "../utils/lib.js";
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,16}$/;
export const signUp = async (req, res) => {
  const { Name, Email, Password, Address } = req.body;
  try {
    if (!Name || !Email || !Password || !Address) {
      return res.status(400).json({ message: "All fields are required !! " });
    }
    if (!passwordRegex.test(Password)) {
      return res.status(400).json({
      message:
      "Password must be 8-16 characters, include at least one uppercase letter and one special character."
  });
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
export const logIn = (req, res) => {
  res.send("Welcome to the LogIn Page");
};
export const logOut = (req, res) => {
  res.send("Welcome to the LogOut Page");
};
export const checkAuth = (req, res) => {
  res.send("Welcome to the checkAuth Page");
};
