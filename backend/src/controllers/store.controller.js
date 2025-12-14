import * as storeModel from "../models/store.model.js";
import {
  handleError,
  handleValidationError,
} from "../utils/errorHandler.js";
export const addStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;
    if (!name || !email || !address || !owner_id) {
      return handleValidationError(res, "Name, email, address, and owner are required");
    }

    const newStore = await storeModel.addStore({ name, email, address, owner_id });
    console.log(newStore);
    res.status(201).json({ message: "New Store added Successfully !!" });
  } catch (error) {
    return handleError(res, error, "addStore controller");
  }
};

export const getAllStores = async (req, res) => {
  try {
    const { name, address } = req.query;
    const stores = await storeModel.getAllStores({ name, address });
    res.json(stores);
  } catch (error) {
    return handleError(res, error, "getAllStores controller");
  }
};

