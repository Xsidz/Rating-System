import * as dashBoardModel from "../models/dashboard.model.js";
import { handleError } from "../utils/errorHandler.js";

export const getDashboard = async (req, res) => {
  try {
    const stats = await dashBoardModel.getDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    return handleError(res, error, "getDashboard controller");
  }
};