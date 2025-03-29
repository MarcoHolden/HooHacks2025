require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;

app.use(express.json());

app.post('/generate-persona', async (req, res) => {
    try {
        const { interactionData } = req.body;
        const geminiApiKey = process.env.AIzaSyBbLj_J4KJ7fhcDZM1lGCWIJZFXSYewwp4;

        const geminiResponse = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
            {
                contents: [
                    {parts: [
                        {
                            text: `Analyze the following user interaction data and generate questions that correspond with the learning style. ${JSON.stringify(
                            interactionData
                        )}. Include the learning styles, preferred methods, misconceptions, and recommendations.`,
                        },
                    ],
                },
            ],
        }
    );

    const persona = geminiResponse.data.candidates[0].content.parts[0].text;
    res.json({ persona: persona });
} catch (error) {
    console.error('Error generating persona:', error);
    res.status(500).json({ error: 'Failed to generate persona. '});
}
});
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});