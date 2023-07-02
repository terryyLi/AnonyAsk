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


app.use('/api', routes);

app.get('/test', async (req, res) => {
    try {
      // Create a sample question
      const question = new ResponseModel({
        content: 'Sample question content',
        time: new Date(),
      });
      await question.save();
  
      // Create a sample answer
      const answer = new ResponseModel({
        content: 'Sample answer content',
        time: new Date(),
      });
      await answer.save();
  
      // Create a sample conversation with the response
      const conversation = new ConversationModel({
        question: question,
        answer: answer,
      });
      await conversation.save();
  
      // Create a sample post with the conversation
      const post = new PostModel({
        title: 'Sample post',
        time: new Date(),
        conversations: [conversation],
      });
      await post.save();
  
      // Create a sample user with the post
      const user = new UserModel({
        username: 'sample_user',
        posts: [post],
      });
      await user.save();
  
      res.status(200).json({
        message: 'Sample data created successfully',
        user,
        post,
        conversation,
        question,
        answer,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create sample data' });
    }
  });

  app.get('/test-fetch', async (req, res) => {
    try {
      // Get the first user
      const user = await UserModel.findOne();
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Get the posts of the first user
      const posts = user.posts;
  
      if (posts.length === 0) {
        return res.status(404).json({ error: 'No posts found for the user' });
      }
  
      // Get the conversations of the first post
      const post = posts[0];
      const conversations = await ConversationModel.find({ _id: { $in: post.conversations } });
  
      res.status(200).json({
        user,
        posts,
        conversations,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
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
