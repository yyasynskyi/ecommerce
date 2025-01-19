import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import authRouter from './routes/auth.route.js';
import productsRouter from './routes/product.router.js';
import cartRouter from './routes/cart.route.js';
import couponRouter from './routes/coupon.route.js';


//App config
const app = express();
const port = process.env.PORT || 9000;
connectDB();
connectCloudinary();

//Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//API Endpoints
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/coupon', couponRouter)

//Listener
app.listen(port, () => console.log(`Listening on localhost:${port}`));