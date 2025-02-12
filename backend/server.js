import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';

import { connectDataBase } from './library/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)

app.listen(5000, () => {
    console.log('Połacznie z serwerem: http://localhost:' + PORT);  

    connectDataBase();
});

//4eUzWN5LDKK6EtsJ