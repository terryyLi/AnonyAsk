const assert = require('assert');
const request = require('supertest');
const app = require('../index');
const UserModel = require('../models/UserModel');
const PostModel = require('../models/PostModel');

describe('Post Routes', () => {
  // Define a sample user for testing
  let user;

  before(async () => {
    // Clear the test database or set up a separate test database
    // You may need to modify this based on your setup
    await UserModel.deleteMany();
    await PostModel.deleteMany();

    // Create a sample user
    user = new UserModel({
      username: 'sample_user',
      posts: [],
    });
    await user.save();
  });

  describe('GET /api/posts/user/:username', () => {
    it('should retrieve posts by username', (done) => {
      request(app)
        .get('/api/posts/user/sample_user')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          assert(Array.isArray(res.body), 'Response should be an array');
          assert(res.body.length === 0, 'Should not retrieve any posts');
          done();
        });
    });

    it('should return 404 if user does not exist', (done) => {
      request(app)
        .get('/api/posts/user/nonexistent_user')
        .expect(404)
        .end(done);
    });
  });

  describe('POST /api/posts/user/:username', () => {
    it('should create a new post', (done) => {
      request(app)
        .post('/api/posts/user/sample_user')
        .send({ title: 'New Post' })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          assert(res.body.title === 'New Post', 'Post title should match');
          done();
        });
    });

    it('should return 404 if user does not exist', (done) => {
      request(app)
        .post('/api/posts/user/nonexistent_user')
        .send({ title: 'New Post' })
        .expect(404)
        .end(done);
    });
  });
});
