import * as userModel from "../models/user.model.js";
import {
  validatePassword,
  PASSWORD_VALIDATION_MESSAGE,
} from "../utils/passwordUtils.js";
import {
  handleError,
  handleValidationError,
  handleNotFoundError,
} from "../utils/errorHandler.js";


export const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    if (!validatePassword(password)) {
      return handleValidationError(res, PASSWORD_VALIDATION_MESSAGE);
    }

    const newUser = await userModel.addUser(name, email, password, address, role);
    console.log(newUser);
    return res.status(201).json({ message: "New User Created Successfully !!" });
  } catch (error) {
    return handleError(res, error, "addUser controller");
  }
};




export const getAllUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;
    const users = await userModel.getAllUsers({ name, email, address, role });
    res.json(users);
  } catch (error) {
    return handleError(res, error, "getAllUsers controller");
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.getUserDetails(id);

    if (!user) return handleNotFoundError(res, "User not found");

    res.json(user);
  } catch (error) {
    return handleError(res, error, "getUserDetails controller");
  }
};