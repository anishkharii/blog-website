const express = require("express");
const mongoose = require("mongoose");
const routes = require('./routes/routes');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true })); 

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
