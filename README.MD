# Yoga Recommendation Server

This Node.js server uses the Express framework to provide yoga recommendations through the OpenAI API.

## Setup

### Environment Variables

Create a `.env` file in the root of your project and add your OpenAI API key:

OPENAI_API_KEY=your_openai_api_key

The `dotenv` package is used to load these variables.

### Dependencies

- Express
- node-fetch
- dotenv

Install these packages using npm:

npm install express node-fetch dotenv

## Server

### Initializing Express

const express = require('express');
const app = express();
app.use(express.json());

### OpenAI API Integration

The OpenAI API is used to get yoga recommendations:

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

async function getOpenAIResponse(userData) {
    // ...
}

### Endpoint: `/recommendations`

POST to this endpoint with user data to get yoga recommendations.

app.post('/recommendations', async (req, res) => {
    // ...
});

### Starting the Server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

## Usage

Send a POST request to `/recommendations` with user data in JSON format:

{
    "age": 30,
    "gender": "female",
    "yogaExperience": "beginner"
}

You will receive a list of yoga poses tailored to the provided user data.
