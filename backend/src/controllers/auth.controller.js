import { getPool } from "../utils/initDB.js";
import { gennToken } from "../utils/lib.js";
import {
  validatePassword,
  hashPassword,
  comparePassword,
  PASSWORD_VALIDATION_MESSAGE,
} from "../utils/passwordUtils.js";
import {
  handleError,
  handleValidationError,
} from "../utils/errorHandler.js";
export const signUp = async (req, res) => {
  const { Name, Email, Password, Address } = req.body;
  try {
    
    if (!Name || !Email || !Password || !Address) {
      return res.status(400).json({ message: "All fields are required !! " });
    }
    if (!validatePassword(Password)) {
      return handleValidationError(res, PASSWORD_VALIDATION_MESSAGE);
    }
    const pool = getPool();
    const [existingUser] = await pool.query(
      `SELECT * FROM users WHERE email = ?`,
      [Email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const hashedPass = await hashPassword(Password);

    const [result] = await pool.query(
      `INSERT INTO users(name, email,password,address,role) VALUES(?,?,?,?,'user')`,
      [Name, Email, hashedPass, Address]
    );

    console.log(result);

    const [rows] = await pool.query(
      `SELECT id,name, email, address, role, created_at,updated_at FROM users WHERE id = ?`,
      [result.insertId]
    );

    
    const newUser = rows[0];
    console.log(newUser.id);

    gennToken(newUser.id, res);

    return res.status(200).json(newUser);
  } catch (error) {
    return handleError(res, error, "Signup controller");
  }
};
export const logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!!" });
    }
    const pool = getPool();
    const [row] = await pool.query(`SELECT * FROM users WHERE email = ?`, [
      email,
    ]);

    console.log(row);
    const user = row[0];
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isPassCorrect = await comparePassword(password, user.password);
    if (!isPassCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
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
    return handleError(res, error, "Login controller");
  }
};
export const logOut = (req, res) => {
  try {
    if (!req.cookies.jwt) {
      return res.status(200).json({ message: "Already Logged Out" });
    }

    res.clearCookie("jwt", {
      httpOnly: true,  
      secure: process.env.NODE_ENV !== "development", 
      sameSite: "strict"
    });

    return res.status(200).json({ message: "LoggedOut Successfully" });
  } catch (error) {
    return handleError(res, error, "Logout controller");
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!validatePassword(newPassword)) {
      return handleValidationError(res, PASSWORD_VALIDATION_MESSAGE);
    }

    const pool = getPool();

    
    const [rows] = await pool.query(`SELECT password FROM users WHERE id = ?`, [
      req.user.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not Found!!" });
    }

    const user = rows[0];

    const passwordMatch = await comparePassword(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Current password is incorrect!!" });
    }

    const newHashed = await hashPassword(newPassword);

    
    await pool.query(`UPDATE users SET password = ? WHERE id = ?`, [
      newHashed,
      req.user.id,
    ]);

    console.log("Password Updated");
    res.clearCookie("jwt"); 

    return res.status(200).json({
      message: "Password updated successfully. Please log in again",
    });
  } catch (error) {
    return handleError(res, error, "updatePassword Controller");
  }
};


export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    return handleError(res, error, "CheckAuth controller");
  }
};