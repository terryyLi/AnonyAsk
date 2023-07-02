const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()

const app = express();

const port = process.env.PORT || 5050;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use((req, res, next) => {
  res.send('Welcome to Express');
});


const username = process.env.USERNAME;
const password = process.env.PASSWORD;

const mongodbEndpoint = `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@serverlessinstance0.seutday.mongodb.net/`;

mongoose
  .connect(mongodbEndpoint)
  .then(() => {
    console.log('MongoDB is connected');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
