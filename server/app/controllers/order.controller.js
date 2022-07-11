//Imports
const db = require("../models");
const ordersTable = db.ordersTable.ordersTable; //orders table
const ordersMenuItemTable = db.ordersMenuItemTable.ordersMenuItemTable; //orders_menu_item table
const menuItemTable = db.menuItemTable.menuItemTable; //orders_menu_item table
const usersTable = db.usersTable.usersTable; //users table
const Op = db.Sequelize.Op;

// place new order

exports.place = async (req, res) => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();
  let date = yyyy + "-" + mm + "-" + dd;

  // let hour = today.getHours();
  // let minutes = today.getMinutes();
  // let seconds = today.getSeconds();
  // let time = hour + ":" + minutes + ":" + seconds;

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  let orderDetails = {
    user_id: req.body.user_id,
    order_date: date,
    order_time: formatAMPM(new Date),
  };

  await ordersTable
    .create(orderDetails)
    .then((orderData) => {
      for (let i = 0; i < req.body.items.length; i++) {
        let menuOrderData = {
          order_id: orderData.id,
          menu_item_id: req.body.items[i].id,
          quantity: req.body.items[i].quantity,
        };
        ordersMenuItemTable
          .create(menuOrderData)
          .then(() => {
            if (i === req.body.items.length - 1) {
              res.send({
                status: true,
                message: "Order Placed Successfully.",
              });
            }
          })
          .catch((err) => {
            res.send({
              status: false,
              message: "Failed to add items to orders.",
            });
          });
      }
    })
    .catch((err) => {
      res.send({
        status: false,
        message: "Can't place order. Try again...",
      });
    });
};

// list all orders for individual user
exports.list = async (req, res) => {
  await ordersTable
    .findAll({
      where: { user_id: req.params.id },
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
      order: [
        ['id', 'DESC'],
      ],
    })
    .then((listedOrders) => {
      res.send({
        status: true,
        message: "All Orders Listed for User.",
        data: listedOrders,
      });
    });
};

// list all orders
exports.listAll = async (req, res) => {
  await ordersTable
    .findAll({
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
        {
          model: usersTable,
          required: false,
        },
      ],
      order: [
        ['id', 'DESC'],
      ],
    })
    .then((listedOrders) => {
      res.send({
        status: true,
        message: "All Orders Listed for User.",
        data: listedOrders,
      });
    });
};

// list all orders for date filter
exports.listDateFilter = async (req, res) => {
  await ordersTable
    .findAll({
      where: {order_date: { [Op.between]: [req.body.startDate, req.body.endDate] }},
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
        {
          model: usersTable,
          required: false,
        },
      ],
    })
    .then((listedOrders) => {
      res.send({
        status: true,
        message: "All Orders Listed for User.",
        data: listedOrders,
      });
    });
};

