const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 128
    },
    role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER"
}

});

const User = mongoose.model("User",userSchema)

module.exports = User;