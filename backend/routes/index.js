const express = require('express');
const router = express.Router();
const postRouter = require('./Post');
// Import other route files as needed

// Routes
router.use('/posts', postRouter);
// Add other routes using router.use() for each route file

module.exports = router;
