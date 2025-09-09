import * as adminModel from "../models/admin.model.js";
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,16}$/;

export const getDashboard = async (req, res) => {
  try {
    const stats = await adminModel.getDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

export const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8-16 characters, include at least one uppercase letter and one special character.",
      });
    }

    const newUser = await adminModel.addUser(name, email, password, address, role);
    console.log(newUser)
    return res.status(201).json({message : "New User Created Successfully !!"})
  } catch (error) {
    console.error("Error in addUser controller:", error);
    res.status(500).json({ message: "Failed to add user" });
  }
};

export const addStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;
    if (!name || !email || !address || !owner_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newStore = await adminModel.addStore({ name, email, address, owner_id });
    console.log(newStore)
    res.status(201).json({message : "New Store added Successfuly !!"});
  } catch (error) {
    console.error("Error in addStore:", error);
    res.status(500).json({ message: "Failed to add store" });
  }
};

export const getAllStores = async (req, res) => {
  try {
    const { name, email, address } = req.query;
    const stores = await adminModel.getAllStores({ name, email, address });
    res.json(stores);
  } catch (error) {
    console.error("Error in getAllStores Controller:", error);
    res.status(500).json({ message: "Failed to fetch stores" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;
    const users = await adminModel.getAllUsers({ name, email, address, role });
    res.json(users);
  } catch (error) {
    console.error("Error in getAllusers Conroller:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await adminModel.getUserDetails(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching user controller:", error);
    res.status(500).json({ message: "Failed to fetch user details" });
  }
};