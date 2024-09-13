import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email not provided"],
        unique: true,
    },
    username: {
        type: String,
        required: [true, "Username not provided"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password not provided"],
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },
    verificationTokenExpiration: {
        type: Date,
    },
    resetToken: {
        type: String,
    },
    resetTokenExpiration: {
        type: Date,
    },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
