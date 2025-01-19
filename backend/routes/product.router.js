import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getFeatured,
  getRecommended,
  getCategory,
  toggleFeatured,
} from "../controllers/product.controller.js";
import { isAdmin, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, isAdmin, getProducts);
router.get("/featured", getFeatured);
router.get("/category/:category", getCategory);
router.get("/recommended", getRecommended);
router.post("/", protectRoute, isAdmin, createProduct);
router.patch("/:id", protectRoute, isAdmin, toggleFeatured);
// router.put('/:id', updateProduct);
router.delete("/:id", deleteProduct);

export default router;
