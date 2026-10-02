import mongoose from 'mongoose';


const connectToDB = async () => {
    try {

        await mongoose.connect(process.env.MongoDB);
        console.log("The mongoDB is connected successfully...")

    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(-1);
    }
};


export default connectToDB;
