const validator = require('validator')

const signUpValidation = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("First and Last name should be 4-20 characters");
    }

    if (!validator.isEmail(emailId)) {
        throw new Error("Enter a valid Email Id");
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error("Enter a strong password");
    }
}


const updateProfileValidations = (req, res, next) => {
    const data = req.body;

    const ALLOWED_UPDATES = ['lastName', 'age', 'photoUrl', 'skills', 'gender', 'password', 'about'];
    const isValidUpdates = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

    if (!isValidUpdates) {
        throw new Error("Not valid updates");
    }

    if (data.skills) {
        const skills = [...new Set(data.skills)]
        if (skills.length < 3 || skills.length > 10) {
            throw new Error("There should be 3 to 10 unique skills");
        } else {
            data.skills = skills;
        }
    }

    req.body = data;

    next()
}

module.exports = { signUpValidation, updateProfileValidations }