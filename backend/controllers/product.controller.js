import Product from "../models/product.model.js";
import redis from "../config/redis.js";
import cloudinary from "../config/cloudinary.js";

const updatedFeaturedProductsCache = async () => {
  try {
    const products = await Product.find({ isFeatured: true }).lean();
    await redis.set("featuredProducts", JSON.stringify(products));
  } catch (error) {
    console.log("Error updating featured products cache:\n", error.message);
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getFeatured = async (req, res) => {
  try {
    let products = await redis.get("featuredProducts");
    if (products) {
      return res.status(200).json(JSON.parse(products));
    }

    products = await Product.find({ isFeatured: true }).lean();

    redis.set("featuredProducts", JSON.stringify(products));

    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getRecommended = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 3 } },
      { $project: { _id: 1, name: 1, description: 1, price: 1, image: 1 } },
    ]);

    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });

    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, isFeatured } = req.body;
    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse?.secure_url
        : "",
      isFeatured,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();

    await updatedFeaturedProductsCache();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
      const public_id = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${public_id}`);
        console.log("Image deleted from cloudinary");
      } catch (error) {
        console.log("Error deleting image from cloudinary");
      }
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
