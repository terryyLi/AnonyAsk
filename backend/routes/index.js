const express = require('express');
const router = express.Router();
const postRouter = require('./Post');
const conversationRouter = require('./Conversation');
const userRouter = require('./User');
// Import other route files as needed

// Routes
router.use('/posts', postRouter);
router.use('/conversations', conversationRouter);
router.use('/users', userRouter);
// Add other routes using router.use() for each route file

module.exports = router;
