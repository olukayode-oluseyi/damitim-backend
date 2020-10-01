const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routes/api");
const mongoose = require("mongoose");
const ejs = require('ejs');
const authRouter = require('./routes/auth')
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/damtim/api", router);
app.use("/user", authRouter)
app.use('/public/uploads', express.static('./public/uploads'))



app.use((req, res, next) => {
  const error = new Error(`not found = ${req.originalUrl}`);
  res.status(404);
  next(error);
});
app.use((error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: error.message,
  });
});

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to MongoDb");
  }
);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {  
  console.log(`server running on port ${PORT}`);
});
