import mongoose from 'mongoose';
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            required: true,
            type: String,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true

        },
        password: {
            type: String,
            trim: true,
            required: true
        },

        phoneNumber: {
            type: String,
            require: true,
            trim: true
        }

    },
    {
        timestamps: true
    }
)

userSchema.index(
    { email: 1 },
    {
        unique: true,
        name: "users_email_unique_idx"
    }
);

userSchema.index(
    { fullName: 1 },
    { name: "users_fullname_idx" }
);


userSchema.pre("save", async function () {
    // If password was not modified, don't hash it again
    if (!this.isModified("password")) {
        return;
    }

    // Hash password
    this.password = await bcrypt.hash(this.password, 10);


});

const User = mongoose.model("User", userSchema);

export default User;