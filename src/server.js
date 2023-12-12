const express = require("express");
const app = express();
const db = require("./models");
// const expressValidator = require('express-validator')
const bodyParser = require('body-parser')

const initRoutes = require("./routes/");
const PORT = 3000;
const HOST = '0.0.0.0';
global.__basedir = __dirname + "/..";

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(expressValidator());

initRoutes(app);

// db.sequelize.sync();
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);