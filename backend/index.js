const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const UserModel = require('./models/UserModel');
const PostModel = require('./models/PostModel');
const ConversationModel = require('./models/ConversationModel');
const ResponseModel = require('./models/ResponseModel');
const routes = require('./routes/index');

const app = express();

const port = process.env.PORT || 5050;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(express.json());

const allowedOrigins = ['http://localhost:3000', 'https://anonyask-frontend-odnuj43iea-uc.a.run.app'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use('/api', routes);

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

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

module.exports = app;
