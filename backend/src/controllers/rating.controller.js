import * as ratingModel from "../models/rating.model.js";
import * as storeModel from "../models/store.model.js";
import {
  handleError,
  handleValidationError,
  handleNotFoundError,
  handleUnauthorizedError,
} from "../utils/errorHandler.js";


export const createRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    if (!store_id || !rating) {
      return handleValidationError(res, "store_id and rating are required");
    }

    if (rating < 1 || rating > 5) {
      return handleValidationError(res, "Rating must be between 1 and 5");
    }

    const ratingId = await ratingModel.addRating(user_id, store_id, rating);
    res.status(201).json({ message: "Rating added successfully", ratingId });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return handleValidationError(res, "You already rated this store");
    }
    return handleError(res, error, "createRating controller");
  }
};


export const editRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const { id } = req.params;
    const user_id = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return handleValidationError(res, "Rating must be between 1 and 5");
    }

    const updated = await ratingModel.updateRating(id, user_id, rating);
    if (!updated) {
      return handleNotFoundError(res, "Rating not found or not yours");
    }

    res.json({ message: "Rating updated successfully" });
  } catch (error) {
    return handleError(res, error, "editRating controller");
  }
};




export const storeRatings = async (req, res) => {
  try {
    const { id: storeId } = req.params;


    const store = await storeModel.getStoreById(storeId);
    if (!store) {
      return handleNotFoundError(res, "Store not found");
    }

    if (store.owner_id !== req.user.id) {
      return handleUnauthorizedError(res, "You are not the owner of this store");
    }

    const ratings = await ratingModel.getStoreRatings(storeId);

    res.json({ storeId, ratings });
  } catch (error) {
    return handleError(res, error, "storeRatings controller");
  }
};


export const getUserRatings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const ratings = await ratingModel.getUserRatings(user_id);
    res.json({ ratings });
  } catch (error) {
    return handleError(res, error, "getUserRatings controller");
  }
};

