const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    age: {
        type: Number,
        required: true,
        min: 18
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        validate(value) {
            if(!['Male', 'Female', 'Other'].includes(value)) {
                throw new Error("!!!Invalid value of Gender")
            }
        },
    },
    photoUrl: {
        type: String,
        default: "https://i.pinimg.com/originals/b0/37/fc/b037fcfe7f1070bc639d39e46cb80319.png"
    },
    about: {
        type: String,
        default: "I am an interesting person."
    },
    skills: {
        type: [String]
    }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model("User", userSchema);