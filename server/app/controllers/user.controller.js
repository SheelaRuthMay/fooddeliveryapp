//Imports
const db = require("../models");
const { decrypt } = require("../utils/crypto");
const usersTable = db.usersTable.usersTable; //users table
const Op = db.Sequelize.Op;


// Validate user
exports.ValidateUser = async (req, res) => {
    const email = req.body.email1;
    let decryptedEmail = decrypt(JSON.parse(email));
    //Query for Checks email exist and select the record with that email
    const emailCondition = { email: decryptedEmail };
    const checkEmailInUsers = await usersTable.findAll({ where: emailCondition });

    //Validate email
    if (checkEmailInUsers.length === 0) {
        res.send({
            status: false,
            message: "Invalid user",
        });
    } else {
        res.send({
            status: true,
            message: "Valid user",
        });
    }
};