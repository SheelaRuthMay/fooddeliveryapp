//Internal Imports
const db = require("../models");
const { encrypt } = require("../utils/crypto");
const users = db.usersTable.usersTable; // 'users' table
const Op = db.Sequelize.Op;

// Create and Save a new admin
exports.create = async (req, res) => {
  //check if email already exists
  const email = req.body.email;
  const emailCondition = { email: email };
  const checkEmailInUsers = await users.findOne({ where: emailCondition });

  const password = encrypt(req.body.password); // encrypt password before saving in db
  const encryptedPassword = JSON.stringify(password); // convert to string
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: encryptedPassword,
    isAdmin: false,
  };

  if (checkEmailInUsers) {
    // if email already exists throw error
    res.send({
      status: false,
      message: "Email Already Exist..",
    });
  } else if (!checkEmailInUsers) {
    // if email not available in db
    const userData1 = await users
      .create(userData)
      .then((user) => {
        res.send({
          status: true,
          message: "Successfully Registered. Login to Continue.",
          data: user,
        });
      })
      .catch(function (err) {
        console.log(err);
        console.log("Failed to register. Try again.");
        res.send({
          status: false,
          message: "Failed to register. Try again.",
        });
      });
  }
};
