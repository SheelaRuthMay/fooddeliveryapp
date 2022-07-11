//Imports
const db = require("../models");
const availabilityTable = db.availabilityTable.availabilityTable; //availability table
const Op = db.Sequelize.Op;

// list all availability
exports.list = async (req, res) => {
  await availabilityTable
    .findAll({
      order: [["id", "ASC"]],
    })
    .then((listedAvailability) => {
      res.send({
        status: true,
        message: "All Availabilities Listed.",
        data: listedAvailability,
      });
    });
};
