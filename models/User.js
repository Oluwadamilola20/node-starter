import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 20,
        lowercase: true,
        required: true,
    },
    lastName: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 20,
        lowercase: true,
        required: true,
    },
    phone: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true,
    },
    avatar: String,
    password: {
        type: String,
        trim: true,
        maxLength: 300,
        required: true,
    },
    isActivate: {
    type: Boolean,
    default: false,
    },
    activationToken: String,
    activationTokenExpires: String,
})

const User = mongoose.model("User", userSchema);

export default User;