const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const PostModel = require('../models/PostModel');
const ConversationModel = require('../models/ConversationModel');
const { ObjectId } = require('mongoose');

describe('Conversation Routes', () => {
  // Define a sample post for testing
  let post;

  before(async () => {
    // Clear the test database or set up a separate test database
    // You may need to modify this based on your setup
    await PostModel.deleteMany();
    await ConversationModel.deleteMany();

    // Create a sample post
    post = new PostModel({
      title: 'Sample post',
      time: new Date(),
      conversations: [],
    });
    await post.save();
  });

  describe('GET /api/conversations/:postId', () => {
    it('should retrieve conversations by post ID', async () => {
        const postId = post._id
        const response = await request(app)
          .get(`/api/conversations/${postId}`)
          .expect(200);
    
        const conversations = response.body;
        assert(Array.isArray(conversations)); // Check if the response is an array of conversations
      });

    it('should return 404 if post does not exist', async () => {
      const nonexistentPostId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/api/conversations/${nonexistentPostId}`)
        .expect(404);
    });
  });

  describe('POST /api/conversations/:postId', () => {
    it('should create a new conversation for a post', async () => {
        const postId = post._id
        const content = 'Sample question';
    
        const response = await request(app)
          .post(`/api/conversations/${postId}`)
          .send({ content })
          .expect(201);
    
        const { conversation, question } = response.body;
        assert.strictEqual(question.content, content); // Check if the question content matches
        assert.strictEqual(conversation.question._id.toString(), question._id.toString()); // Check if the conversation references the question
    
        const savedConversation = await ConversationModel.findById(conversation._id);
        assert.strictEqual(conversation.question._id.toString(), question._id.toString()); // Check if the saved conversation references the question
      });

    it('should return 404 if post does not exist', async () => {
      const nonexistentPostId = new mongoose.Types.ObjectId();
      await request(app)
        .post(`/api/conversations/${nonexistentPostId}`)
        .send({ content: 'Sample question' })
        .expect(404);
    });
  });
});
