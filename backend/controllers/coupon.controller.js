import Coupon from "../models/coupon.model.js"

export const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.find({ userId: req.user._id });
        res.status(200).json(coupon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
} 