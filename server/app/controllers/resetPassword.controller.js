//External Imports
const ejs = require("ejs");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/app/public/views"));

//Internal Imports
const { encrypt, decrypt } = require("../utils/crypto");
const commonConfig = require("../config/common.config.js");
const emailConfig = require("../config/credentials.js");
const transporter = nodemailer.createTransport(emailConfig.emailConf); // Node Mailer
const fromEmail = emailConfig.emailConf.auth.user;
const db = require("../models");
const users = db.usersTable.usersTable;
const Op = db.Sequelize.Op;

// Add user Details
exports.passwordResetLink = async (req, res) => {
    const email1 = req.body.email;
    const encryptEmail = encrypt(email1); // encrypt email
    const email = JSON.stringify(encryptEmail); // convert to string
    console.log(JSON.parse(email))
    const resetLink = commonConfig.frontEndUrl + "/reset-password/" + email;

    //Query for Checks email exist and select the record with that email
    const emailCondition = { email: email1 };
    const checkEmailInUsers = await users.findAll({ where: emailCondition });

    //Validate email
    if (checkEmailInUsers.length === 0) {
        res.send({
            status: false,
            message: "This email is not registered with us",
        });
    } else {
        const userName = checkEmailInUsers[0].user_name;
        //Send reset password link through email if email exist
        let userAcknowlegementOption;
        ejs.renderFile(
            __dirname +
      "/../public/views/passwordReset.ejs",
            { name: userName, link: resetLink }, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    let user = {
                        from: fromEmail,
                        to: email1,
                        subject: 'Reset Password',
                        html: data
                    };
                    userAcknowlegementOption = user
                }
            });

        transporter
            .sendMail(userAcknowlegementOption)
            .then(function (errorInner) {
                res.send({
                    status: true,
                    message:
                        "Password reset link sent to your registered email",
                });
            })
            .catch(function (err) {
                console.log(err);
                res.status({
                    status: false,
                    message:
                        "Unable to send password reset link to your email. Please try again later",
                });
            });
    }
};

exports.updateUserPassword = async (req, res) => {
    const email = req.body.email1;

    let decryptedEmail = decrypt(email); //decrypt email from front end
    console.log(decryptedEmail)

    const newPassword = encrypt(req.body.password); // encrypt password before saving in db
    const encryptedPassword = JSON.stringify(newPassword); // convert to string

    //Query for Checks email exist and select the record with that email
    const emailCondition = { email: decryptedEmail };
    const checkEmailInUsers = await users.findAll({ where: emailCondition });
    if (checkEmailInUsers.length === 0) {
        res.send({
            status: false,
            message: "This email is not registered with us",
        });
    } else {
        //Update password
        const updatePassword = await users
            .update({ 
                password: encryptedPassword, 
                modified_on: new Date(),
                modified_by: checkEmailInUsers[0].id
            }, {
                where: { email: decryptedEmail }, 
                returning: true 
            })
            .catch((err) => {
                res.send({
                    status: false,
                    message: "Can't update password. Try Again..",
                });
            });
        res.send({
            status: true,
            message: "Password Updated",
            data: updatePassword
        });
    }
};