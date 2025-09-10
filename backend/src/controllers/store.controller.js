import *  as storeModel from "../models/store.model.js"
export const addStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;
    if (!name || !email || !address || !owner_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newStore = await storeModel.addStore({ name, email, address, owner_id });
    console.log(newStore)
    res.status(201).json({message : "New Store added Successfuly !!"});
  } catch (error) {
    console.error("Error in addStore:", error);
    res.status(500).json({ message: "Failed to add store" });
  }
};

export const getAllStores = async (req, res) => {
  try {
    const { name, address } = req.query;
    const stores = await storeModel.getAllStores({ name, address });
    res.json(stores);
  } catch (error) {
    console.error("Error in getAllStores Controller:", error);
    res.status(500).json({ message: "Failed to fetch stores" });
  }
};

