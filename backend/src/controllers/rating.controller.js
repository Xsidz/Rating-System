import * as ratingModel from "../models/rating.model.js";
import * as storeModel from "../models/store.model.js";


export const createRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    if (!store_id || !rating) {
      return res.status(400).json({ message: "store_id and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const ratingId = await ratingModel.addRating(user_id, store_id, rating);
    res.status(201).json({ message: "Rating added successfully", ratingId });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "You already rated this store" });
    }
    console.error("Error creating rating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const editRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const { id } = req.params;
    const user_id = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const updated = await ratingModel.updateRating(id, user_id, rating);
    if (!updated) {
      return res.status(404).json({ message: "Rating not found or not yours" });
    }

    res.json({ message: "Rating updated successfully" });
  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




export const storeRatings = async (req, res) => {
  try {
    const { id: storeId } = req.params;


    const store = await storeModel.getStoreById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }


    if (store.owner_id !== req.user.id) {
      return res.status(403).json({ message: "You are not the owner of this store" });
    }


    const ratings = await ratingModel.getStoreRatings(storeId);

    res.json({ storeId, ratings });
  } catch (error) {
    console.error("Error fetching store ratings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getUserRatings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const ratings = await ratingModel.getUserRatings(user_id);
    res.json({ ratings });
  } catch (error) {
    console.error("Error fetching user ratings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

