require('dotenv').config(); // Loads environment variables from a .env file into process.env
const express = require('express'); // Importing Express framework
const fetch = require('node-fetch'); // Importing node-fetch to enable HTTP requests in Node.js
const app = express(); // Creating an Express application
app.use(express.json()); // Middleware to parse JSON bodies

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'; // URL for OpenAI API

// Function to get a response from OpenAI based on user data
const getOpenAIResponse = async (userData) => {
    // Constructing a prompt for OpenAI
    const prompt = `Age: ${userData.age}, Gender: ${userData.gender}, Yoga Experience: ${userData.yogaExperience}`;

    try {
        // Making a POST request to OpenAI API
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Using the API key from environment variable
            },
            body: JSON.stringify({
                model: 'gpt-4-turbo-preview', // Model to use
                messages: [
                    {
                        "role": "system",
                        "content": "You are a yoga assistant. Respond with a JSON formatted list of yoga poses, including keys for 'pose_name', 'benefits', and 'instructions'."
                    },
                    {
                        "role": "user",
                        "content": `Age: ${userData.age}, Gender: ${userData.gender}, Yoga Experience: ${userData.yogaExperience}. Provide yoga poses in a JSON format with keys 'pose_name', 'benefits', and 'instructions'.`
                    }
                ]
                
            })
        });

        const data = await response.json(); // Parsing the response to JSON
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            const content = data.choices[0].message.content.trim();

            // Remove the '```json' and '```' that wrap the actual JSON content
            const jsonContent = content.replace(/```json\n|\n```/g, '');

            // Parse the JSON content to a JavaScript object
            const yogaPoses = JSON.parse(jsonContent);

            return yogaPoses;
        } else {
            // Log error if response structure is not as expected
            console.error('Unexpected response structure:', data);
            return null;
        }
        
    } catch (error) {
        // Log any error during the fetch operation
        console.error('Error fetching from OpenAI:', error);
        return null;
    }
};

// Endpoint to get yoga recommendations
app.post('/recommendations', async (req, res) => {
    const userData = req.body; // Extracting user data from request body
    const aiResponse = await getOpenAIResponse(userData); // Getting response from OpenAI
    if (aiResponse) {
        res.json({ recommendations: aiResponse }); // Sending response back to client
    } else {
        // Sending error response if failed to fetch recommendations
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
});

const PORT = process.env.PORT || 3000; // Server port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Starting the server
