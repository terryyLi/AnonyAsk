const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
const PostModel = require('../models/PostModel');
const ConversationModel = require('../models/ConversationModel');
const ResponseModel = require('../models/ResponseModel');

// Route to get posts by user name
router.get('/user/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // Find the user by username
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the posts of the user
    const posts = await PostModel.find({ _id: { $in: user.posts } }).populate('conversations');

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Route to get posts by id
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    // Find the user by id
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Route to create a new post
router.post('/user/:username', async (req, res) => {
    const { username } = req.params;
    const { title } = req.body;

    try {
        // Find the user by username
        const user = await UserModel.findOne({ username });

        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }

        // Create a new post
        const post = new PostModel({
            title,
            time: new Date(),
            conversations: [],
        });

        // Save the post
        await post.save();

        // Add the post to the user's posts array
        user.posts.push(post._id);
        await user.save();

        res.status(201).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create a new post' });
    }
});


  
module.exports = router;
