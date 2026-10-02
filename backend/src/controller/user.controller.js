import User from "../model/user.model.js";

import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
    try {

        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        // 3. Create user
        const user = await User.create({
            fullName,
            email,
            password,
        });

        // 5. Send response
        return res.status(200).json({
            message: "user register successfully...."
        });


    } catch (error) {

        console.error("Login error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });


    }
}

export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email && !password) {

            return res.status(400).json({
                message: "Email and password are required",
            });

        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "the user not register frist go register"
            })
        }

        // 3. Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({
            message: "Login successfully...",
            user: userResponse,
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }


}