const express = require("express");
const mongoose = require("mongoose");
const routes = require('./routes/routes');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const port = 8080 || process.env.PORT;

const uri =process.env.MONGO_URI; 

mongoose.connect(uri).
then(() => {
  console.log("Connected to server.");
});

app.use('/',routes);

app.listen(port, () => {
  console.log(`Server is running at PORT: ${port}`);
});
