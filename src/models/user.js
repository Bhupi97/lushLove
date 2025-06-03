const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email address: " + value)
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Weak Password!!!")
            }
        }
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
        default: "https://i.pinimg.com/originals/b0/37/fc/b037fcfe7f1070bc639d39e46cb80319.png",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("Invalid image url: "+ value)
            }
        }
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


userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ id: user._id}, 'MayTheCodeBeWithYou$2025', { expiresIn: "1d" });
   
    return token;
};

userSchema.methods.validatePassword = async function (passwordByUser) {
    const user = this;
    const hashedPassword = user.password;
    const isPasswordMatched = await bcrypt.compare(passwordByUser, hashedPassword);

    return isPasswordMatched;
};

module.exports = mongoose.model("User", userSchema);