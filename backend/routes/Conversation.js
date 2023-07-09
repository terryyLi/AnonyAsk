const express = require('express');
const router = express.Router();
const PostModel = require('../models/PostModel');
const ConversationModel = require('../models/ConversationModel');
const ResponseModel = require('../models/ResponseModel');


// Route to get all conversations by post ID
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    // Find the post by ID and populate the conversations field
    const post = await PostModel.findById(postId)
    .populate({
        path: 'conversations',
        populate: {
            path: 'question answer',
            model: 'Response',
        },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(post.conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Route to create a conversation to a post with question
router.post('/:postId', async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;

    try {
        // Find the post by ID
        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Create a new response object
        const question = new ResponseModel({
            content,
            time: new Date(),
        });


        // Save the response object
        await question.save();

        // Create a new conversation object
        const conversation = new ConversationModel({
            question: question,
            answer: null,
        });

        // Save the conversation object
        await conversation.save();

        // Add the conversation to the post
        post.conversations.push(conversation);

        // Save the updated post
        await post.save();

        res.status(201).json({
            message: 'Response added successfully',
            conversation,
            question,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add response' });
    }
});

// Imports the Google Cloud client library
const language = require('@google-cloud/language');

// Creates a client
const client = new language.LanguageServiceClient();


// Route to add an answer to a conversation
router.post('/:conversationId/answer', async (req, res) => {
    const { conversationId } = req.params;
    const { content } = req.body;

    const document = {
        content: content,
        type: 'PLAIN_TEXT',
    };

    // Detects the sentiment of the document
    const [result] = await client.analyzeSentiment({document});

    const sentiment = result.documentSentiment;
    console.log('Document sentiment:');
    console.log(`  Score: ${sentiment.score}`);
    console.log(`  Magnitude: ${sentiment.magnitude}`);

    const sentences = result.sentences;
    sentences.forEach(sentence => {
    console.log(`Sentence: ${sentence.text.content}`);
    console.log(`  Score: ${sentence.sentiment.score}`);
    console.log(`  Magnitude: ${sentence.sentiment.magnitude}`);
    });

    try {
    // Find the conversation by ID
    const conversation = await ConversationModel.findById(conversationId);

    if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
    }

    // Create a new response object for the answer
    const answer = new ResponseModel({
        content,
        time: new Date(),
    });

    // Save the answer
    await answer.save();

    // Update the conversation with the answer
    conversation.answer = answer;

    // Save the updated conversation
    await conversation.save();

    res.status(201).json({
        message: 'Answer added successfully',
        conversation,
        answer,
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add answer' });
    }
});
  

module.exports = router;
