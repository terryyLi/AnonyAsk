const fetch = require('node-fetch');
const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();

const url = 'https://language.googleapis.com/v1/documents:moderateText';
const accessToken = process.env.ACCESS_TOKEN; // Replace with your actual access token
const projectId = process.env.PROJECT_ID;

function shouldBeModerated(input) {
  console.log(input);
  const excludedCategories = [
    'Health',
    'Religion & Belief',
    'Finance',
    'Legal',
    'Politics'
  ];

  const filteredInput = input.filter(item => !excludedCategories.includes(item.name));

  let highestConfidenceCategory = null;
  let highestConfidence = 0;

  for (let i = 0; i < filteredInput.length; i++) {
    const currentItem = filteredInput[i];
    if (currentItem.confidence > highestConfidence) {
      highestConfidence = currentItem.confidence;
      highestConfidenceCategory = currentItem.name;
    }
  }

  if (highestConfidenceCategory && highestConfidence > 0.6) {
    return `Your message contains potential ${highestConfidenceCategory} contents!`;
  }

  return 'Looks good!';
}



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
      return shouldBeModerated(data.moderationCategories);
    } else {
      throw new Error('Request failed with status ' + response.status);
    }
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

async function isPositiveContent(content) {
    const document = {
        content: content,
        type: 'PLAIN_TEXT',
    };

    // Detects the sentiment of the document
    const [result] = await client.analyzeSentiment({document});

    const sentiment = result.documentSentiment;
    console.log("sentiment score is: ", sentiment.score)
    return sentiment.score >= 0;
}

module.exports = {
  moderateContent,
  isPositiveContent
};
