import mangoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDataBase = async () => {
    try {
        const con = await mangoose.connect(process.env.MANGO_URL);
        console.log(`MongoDB połaczone: ${con.connection.host}`);
    } catch  (error) {
        console.log("Bład połączenia z bazą danych:", error.message);
        process.exit(1);
    }
};