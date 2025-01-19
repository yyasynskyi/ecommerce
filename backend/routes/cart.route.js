import express from "express";
import {
    addToCart,
    updateQuantity,
    getCartItems,
    clearCart,
} from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, addToCart);
router.put("/:id", protectRoute, updateQuantity);
router.get("/", protectRoute, getCartItems);
router.delete("/", protectRoute, clearCart);

export default router;
