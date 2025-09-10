import * as dashBoardModel from "../models/dashboard.model.js"

export const getDashboard = async (req, res) => {
  try {
    const stats = await dashBoardModel.getDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};