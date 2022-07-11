const express = require("express");
const path = require('path');
const ejs = require("ejs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const apiRouter = require("./app/routes/api");
// set the view engine to ejs
app.set("view engine", "ejs");
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/app/public/views"));
app.set('views', path.join(__dirname, '/app/public/views'));


const corsOptions = {
 origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */

const db = require("./app/models");
db.sequelize.sync();
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
// console.log("Drop and re-sync db.");
// });

// simple route
app.get("/", (req, res) => {
 res.json({ message: "Welcome to food delivery application." });
});


 //require("./app/routes/tutorial.routes")(app);
// set port, listen for requests
const PORT = process.env.PORT || 3001;
app.use("/api", apiRouter);
app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}.`);
});