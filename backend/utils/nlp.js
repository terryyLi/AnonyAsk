const fetch = require('node-fetch');
const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();

const url = 'https://language.googleapis.com/v1/documents:moderateText';
const accessToken = process.env.ACCESS_TOKEN; // Replace with your actual access token
const projectId = process.env.PROJECT_ID;

async function moderateContent(content) {
  const requestBody = {
    document: {
      type: 'PLAIN_TEXT',
      content: content
    }
  };

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'x-goog-user-project': projectId,
    'Content-Type': 'application/json; charset=utf-8'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Request failed with status ' + response.status);
    }
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

async function getSentimentScore(content) {
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

    return sentiment.score;
}

module.exports = {
  moderateContent,
  getSentimentScore
};
