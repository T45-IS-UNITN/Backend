const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
require("dotenv/config");

app.use(bodyParser.json());

//routes
//import all routes
fs.readdirSync("./routes").forEach((file) => {
  if (file.endsWith(".js")) {
    const route = require(`./routes/${file}`);
    const routeName = file.split(".")[0];
    app.use(`/${routeName}`, route);
  }
});

// connecto to db
mongoose.connect(process.env.DB_CONNECTION);

// start server
app.listen(3000);
