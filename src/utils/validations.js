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


const editProfileValidation = (req) => {
    const inputData = req.body;

    const allowedEditFields = ['firstName', 'lastName', 'age', 'photoUrl', 'skills', 'gender', 'about'];
    const isValidEdit = Object.keys(inputData).every((field) => allowedEditFields.includes(field));

    if (!isValidEdit) {
        throw new Error("Not valid updates");
    }

    if( inputData.photoUrl && !validator.isURL(inputData.photoUrl)){
        throw new Error("Photo URL is not valid");
    }


    if (inputData.skills) {
        const skills = [...new Set(inputData.skills)]
        if (skills.length < 3 || skills.length > 10) {
            throw new Error("There should be 3 to 10 unique skills");
        } else {
            inputData.skills = skills;
        }
    }

    return inputData;
}

module.exports = { signUpValidation, editProfileValidation }