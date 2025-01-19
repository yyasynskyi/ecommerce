import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find((item) => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push(productId);
        }

        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.log("Error in addToCart controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const user = req.user;

        const existingProduct = user.cartItems.find((item) => item.id === id);

        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        if (quantity === 0) {
            user.cartItems = user.cartItems.filter((item) => item.id !== id);
            await user.save();
            res.status(200).json(user.cartItems);
        }

        existingProduct.quantity = quantity;
        await user.save();
        res.status(200).json(user.cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getCartItems = async (req, res) => {
    try {
        const products = await Product.find({ _id: { $in: req.user.cartItems } });

        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find((item) => item.id === product.id)
            return { ...product.toJSON(), quantity: item.quantity };
        })

        res.status(200).json(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const clearCart = async (req, res) => {
    try {
        const user = req.user;
        const { productId } = req.body;

        if (productId) {
            user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        } else {
            user.cartItems = [];
        }

        await user.save();
        res.status(200).json(user.cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

