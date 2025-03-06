import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import https from 'https';

import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';

import { connectDataBase } from './library/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const sslOptions = {
    key: fs.readFileSync('./backend/certs/klucz.key'),
    cert: fs.readFileSync('./backend/certs/cert.crt')
};

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/coupons", couponRoutes)
app.use("/api/payments", paymentRoutes)

https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`Połączenie z serwerem HTTPS: https://localhost:${PORT}`);
    connectDataBase();
});