//Imports
const db = require("../models");
const menuItemTable = db.menuItemTable.menuItemTable; //users table
const availabilityTable = db.availabilityTable.availabilityTable; //availability table
const menuItemAvailabilityTable =
  db.menuItemAvailabilityTable.menuItemAvailabilityTable; //menu_item_availability table
const ordersMenuItemTable = db.ordersMenuItemTable.ordersMenuItemTable; //orders_menu_item table
const Op = db.Sequelize.Op;
const Sequelize = db.sequelize;

// list all menu items
exports.list = async (req, res) => {
  await menuItemTable
    .findAll({
      include: [
        {
          model: menuItemAvailabilityTable,
          required: false,
          include: [
            {
              model: availabilityTable,
              required: false,
            },
          ],
        },
      ],
    })
    .then((listedMenu) => {
      res.send({
        status: true,
        message: "All Menu Items Listed.",
        data: listedMenu,
      });
    });
};

// add new item to menu and insert in menu_item_availability
exports.add = async (req, res) => {
  let itemDetails = {
    menu_item_name: req.body.menu_item_name,
    menu_item_type: req.body.menu_item_type,
    cuisine: req.body.cuisine,
    price: req.body.price,
    created_by: req.body.created_by,
    created_on: new Date(),
  };

  await menuItemTable
    .create(itemDetails)
    .then(async(itemDataValues) => {
      for (let i = 0; i < req.body.availability.length; i++) {
        let availId = await availabilityTable
        .findOne({ where: { name : req.body.availability[i]}  })
        let availabilityData = {
          menu_item_id: itemDataValues.id,
          availability_id: availId.id,
        };
        menuItemAvailabilityTable
          .create(availabilityData)
          .then(() => {
            if (i === req.body.availability.length - 1) {
              res.send({
                status: true,
                message: "New Item Added to Menu Successfully.",
              });
            }
          })
          .catch((err) => {
            res.send({
              status: false,
              message: "Failed to insert availability data.",
            });
          });
      }
    })
    .catch((err) => {
      res.send({
        status: false,
        message: "Can't add menu item. Try again...",
      });
    });
};

// Delete an item and its data in menu_item_availability
exports.delete = async (req, res) => {
  const itemId = req.params.id;
  const deleteItem = await menuItemAvailabilityTable
    .destroy({ where: { menu_item_id: itemId }, returning: true })
    .then(() => {
      menuItemTable
        .destroy({ where: { id: itemId }, returning: true })
        .then(() => {
          res.send({
            status: true,
            message: "Item Deleted Successfully",
          });
        });
    })
    .catch((err) => {
      res.send({
        status: false,
        message: "Can't delete project. Try Again..",
      });
    });
};

// list frequently ordered items
exports.listFreq = async (req, res) => {
  await ordersMenuItemTable
    .findAll({
      attributes: [
        "menu_item_id",
        [Sequelize.fn("count", Sequelize.col("quantity")), "totalTimes"],
      ],
      group: ["menu_item_id"],
      order: [[Sequelize.col("totalTimes"), "DESC"]],
      raw: true,
      // include: [
      //   {
      //     model: menuItemTable,
      //     include: [
      //       {
      //         model: menuItemAvailabilityTable,
      //         include: [
      //           {
      //             model: availabilityTable,
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // ],
    })
    .then(async (listedMenu) => {
      let type = req.body.type;
      let result = [];
      for (let i = 0; i < listedMenu.length; i++) {
        let menuItemId = listedMenu[i].menu_item_id;
        let condition;
        if (type === "all") {
          condition = { id: menuItemId };
        } else {
          condition = { id: menuItemId, menu_item_type: type };
        }
        listedMenu[i].menu = await menuItemTable.findAll({
          where: condition,
          required: true,
          include: [
            {
              model: menuItemAvailabilityTable,
              include: [
                {
                  model: availabilityTable,
                },
              ],
            },
          ],
        });
      }
      let result1 = listedMenu.filter(checkType);

      function checkType(val) {
        if (val.menu.length > 0) {
          return val;
        }
      }
      res.send({
        status: true,
        message: "Frequently Ordered Items Listed.",
        data: result1,
      });
    });
};
