//module.exports = app => {
const router = require("express").Router();

const register = require("../controllers/adminRegister.controller.js");
const login = require("../controllers/login.controller.js");
const passwordReset = require("../controllers/resetPassword.controller.js");
const menu = require("../controllers/menu.controller.js");
const availability = require("../controllers/availability.controller.js");
const order = require("../controllers/order.controller.js");
const user = require("../controllers/user.controller.js");

// Register a new user
router.post("/users/register", register.create);
//User Login
router.post("/users/login", login.find);
//Validate user
router.post("/validate/user", user.ValidateUser);
//Password reset link send
router.post("/users/password/reset/link", passwordReset.passwordResetLink);
//Update password
router.put("/update/user/password", passwordReset.updateUserPassword);


//list all menu items
router.get("/list/menu", menu.list);
//add item to menu
router.post("/add/item", menu.add);
//delete item from menu
router.get("/delete/item/:id", menu.delete);
//list frequently ordered
router.post("/list/freqOrdered", menu.listFreq);


//place order
router.post("/place/order", order.place);
//list order for individual users
router.get("/list/order/:id", order.list);
//list all orders
router.get("/listAll/orders", order.listAll);
//list all orders for date filter
router.post("/listAll/orders/dateFilter", order.listDateFilter);


//list all availability
router.get("/list/availability", availability.list);

module.exports = router;
