import { app } from "./src/app.js";
import connectToDB from "./src/config/db.js";
import dotenv from 'dotenv';

dotenv.config();

connectToDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });


