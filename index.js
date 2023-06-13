const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv/config");

app.use(bodyParser.json());

//routes
//import routes
const recensioniRoute = require("./routes/recensioni");

// middleware
app.use("/recensioni", recensioniRoute);

// connecto to db
mongoose.connect(process.env.DB_CONNECTION);

// start server
app.listen(3000);
