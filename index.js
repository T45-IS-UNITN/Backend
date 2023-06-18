const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
require("dotenv/config");

app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));


//routes
//import all routes
fs.readdirSync("./routes").forEach((file) => {
  if (file.endsWith(".js")) {
    const route = require(`./routes/${file}`);
    const routeName = file.split(".")[0];
    app.use(`/${routeName}`, route);
  }
});

// connect to db
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    // start server
    const server = app.listen(3000, () => {
      const { address, port } = server.address();
      console.log(`Server listening on ${address}:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });

module.exports = app;
