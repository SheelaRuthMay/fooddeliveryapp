//Imports
const db = require("../models");
const { decrypt } = require("../utils/crypto");
const cookieParser = require("cookie-parser");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const users = db.usersTable.usersTable; //users table
const ordersTable = db.ordersTable.ordersTable; //users table
const ordersMenuItemTable = db.ordersMenuItemTable.ordersMenuItemTable; //users table
const menuItemTable = db.menuItemTable.menuItemTable; //users table
const Op = db.Sequelize.Op;
// User Login Function
exports.find = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //check email exist
  const emailCondition = { email: email };
  const checkEmailInUsers = await users.findOne({ where: emailCondition });

  // response if email not registered
  if (!checkEmailInUsers) {
    res.send({
      status: false,
      message: "Email is not registered with us",
    });
  } else if (checkEmailInUsers) {
    //function to decrypt password in database
    let decryptedPassword = decrypt(
      JSON.parse(checkEmailInUsers.dataValues.password)
    );
    if (password !== decryptedPassword) {
      res.send({
        status: false,
        message: "Incorrect password",
      });
    } else if (password === decryptedPassword) {
      const userId = checkEmailInUsers.dataValues.id;
      await users
        .findAll({
          where: { id: userId },
          include: [
            {
              model: ordersTable,
              required: false,
              include: [
                {
                  model: ordersMenuItemTable,
                  required: false,
                  include: [
                    {
                      model: menuItemTable,
                      required: false,
                    },
                  ],
                },
              ],
            },
          ],
        })
        .then((allDetails) => {
          //response on success login
          res.send({
            status: true,
            message: "Login success",
            data: allDetails,
          });
        });
    }
  }
};
