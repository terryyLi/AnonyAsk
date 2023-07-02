const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const UserModel = require('../models/UserModel');
const PostModel = require('../models/PostModel');
const ConversationModel = require('../models/ConversationModel');

describe('User Experience', () => {
  let user;
  let postId;

  before(async () => {
    // Clear the test database or set up a separate test database
    // You may need to modify this based on your setup
    await UserModel.deleteMany();
    await PostModel.deleteMany();
    await ConversationModel.deleteMany();

    // Create a sample user
    user = new UserModel({
      username: 'testuser',
    });
    await user.save();
  });

  describe('User Experience Flow', () => {
    it('should create a post, add a conversation, and check the conversation', async () => {
      // Create a new post
      const createPostResponse = await request(app)
        .post('/api/posts/testuser')
        .send({ title: 'Sample Post' })
        .expect(201);

      postId = createPostResponse.body._id;

      // Retrieve the post and check for no conversations
      const getPostResponse1 = await request(app)
        .get(`/api/posts/testuser`)
        .expect(200);

      assert.strictEqual(getPostResponse1.body.length, 1);
      assert.strictEqual(getPostResponse1.body[0].title, 'Sample Post');
      assert.strictEqual(getPostResponse1.body[0]._id, postId);
      assert.strictEqual(getPostResponse1.body[0].conversations.length, 0);

      // Add a conversation with a question
      const createConversationResponse = await request(app)
        .post(`/api/conversations/${postId}`)
        .send({ content: 'Sample question' })
        .expect(201);

      const conversationId = createConversationResponse.body.conversation._id;
      const content = createConversationResponse.body.question.content;
      assert.strictEqual(content, 'Sample question');

      // Retrieve the post and check for the conversation
      const getPostResponse2 = await request(app)
        .get(`/api/posts/testuser`)
        .expect(200);

      assert.strictEqual(getPostResponse2.body.length, 1);
      assert.strictEqual(getPostResponse1.body[0].title, 'Sample Post');
      assert.strictEqual(getPostResponse2.body[0]._id, postId);
      assert.strictEqual(getPostResponse2.body[0].conversations.length, 1);
      assert.strictEqual(getPostResponse2.body[0].conversations[0]._id.toString(), conversationId.toString());

      // Retrieve the conversation and check the question
      const getConversationResponse = await request(app)
        .get(`/api/conversations/${postId}`)
        .expect(200);

      assert.strictEqual(getConversationResponse.body.length, 1);

      assert.strictEqual(getConversationResponse.body[0].question.content, 'Sample question');
      assert.strictEqual(getConversationResponse.body[0].answer, null);

      const responseConversationId = getConversationResponse.body[0]._id

      // Add an answer to the conversation
      const addAnswerResponse = await request(app)
        .post(`/api/conversations/${responseConversationId}/answer`)
        .send({ content: 'Sample answer' })
        .expect(201);

      const answerId = addAnswerResponse.body.answer._id;

      // Retrieve the conversation and check the answer
      const getAnswerResponse = await request(app)
        .get(`/api/conversations/${postId}`)
        .expect(200);

      assert.strictEqual(getAnswerResponse.body.length, 1);
      assert.strictEqual(getAnswerResponse.body[0].question.content, 'Sample question');
      assert.strictEqual(getAnswerResponse.body[0].answer._id, answerId);
      assert.strictEqual(getAnswerResponse.body[0].answer.content, 'Sample answer');
    });
  });
});
