import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';

import { connectDataBase } from './library/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("api/cart", cartRoutes)
app.use("/api/coupons", couponRoutes)
app.use("/api/payment", paymentRoutes)

app.listen(5000, () => {
    console.log('Połacznie z serwerem: http://localhost:' + PORT);  

    connectDataBase();
});

//4eUzWN5LDKK6EtsJ