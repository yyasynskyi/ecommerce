import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    image: {
        type: String,
        // required: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },

}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;