const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');

// Generate a random secret key
const secretKey = "hi"

// Registration Route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = new UserModel({ username, email, password });
    await user.save();
    // Generate JWT
    const token = jwt.sign(
        { userId: user._id, email: user.email, username: user.username },
        secretKey
      );
  
      res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      secretKey
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
