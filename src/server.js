const express = require("express");
const mongoose = require("mongoose");
const routes = require('./routes/routes');
const app = express();
app.use(express.json());
app.use('/',routes);
const port = 8080 || process.env.PORT;

const url =
  "mongodb+srv://anishkhari91:BFeUUPeigL6g1GYA@cluster0.zawyq.mongodb.net/sqilco";

mongoose.connect(url).
  then(() => {
    console.log("Connected to server.");
  });

app.listen(port, () => {
  console.log(`Server is running at PORT: ${port}`);
});
