import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.route.js';

import { connectDataBase } from './library/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/auth", authRoutes)

app.listen(5000, () => {
    console.log('Połacznie z serwerem: http://localhost:' + PORT);  

    connectDataBase();
});

//nglxj3UuVcuMDTRw
//4eUzWN5LDKK6EtsJ