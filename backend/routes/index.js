const express = require('express');
const router = express.Router();
const postRouter = require('./Post');
const conversationRouter = require('./Conversation');
// Import other route files as needed

// Routes
router.use('/posts', postRouter);
router.use('/conversations', conversationRouter);
// Add other routes using router.use() for each route file

module.exports = router;
