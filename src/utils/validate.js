const validator = require("validator");

const validateEmail = (email) => {
    if (!validator.isEmail(email)) {
        throw new Error("Invalid email address!!!");
    }
}

const validateSignup = (req) => {

    const { firstName, lastName, password } = req;
    if(!firstName || !lastName) {
        throw new Error("First name or Last name is Missing");
    }
    else if (firstName.length < 3 || firstName.length > 50) {
        throw new Error("Invalid length of first name!!!");
    }
    else if (lastName.length < 3 || lastName.length > 50) {
        throw new Error("Invalid length of last name!!!");
    }
    else if(!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong");
    }

};

const validateProfileEdit = (req) => {
    const ALLOWED_FIELDS = ['firstName', 'lastName', 'age', 'gender', 'photoUrl', 'about', 'skills'];
    const isUpdateAllowed = Object.keys(req).every((field) => ALLOWED_FIELDS.includes(field))

    return isUpdateAllowed;
}

module.exports = { validateSignup, validateEmail, validateProfileEdit };