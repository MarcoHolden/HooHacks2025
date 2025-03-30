require('dotenv').config();
const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const axios = require('axios');
const app = express();
const port = 3000;

const upload = multer({ storage: multer.memoryStorage()});

app.use(express.json());

app.post('/generate-persona', async (req, res) => {
    try {
        let text = '';
        if (req.file.mimetype === 'application/pdf') {
            const data = await pdfParse(req.file.buffer);
            text = data.text;
        } else if (
            req.file.mimetype ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ){
            const result = await mammoth.extractRawText({ buffer: req.file.buffer });
            text = result.value;
          } else {
            return res.status(400).json({ error: 'Unsupported file type.' });
          }

        const geminiApiKey = process.env.AIzaSyBbLj_J4KJ7fhcDZM1lGCWIJZFXSYewwp4;

        const geminiResponse = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
            {
                contents: [
                    {parts: [
                        {
                            text: `Analyze the following document text: ${text}`,
                        },
                    ],
                },
            ],
        }
    );

    const analysis = geminiResponse.data.candidates[0].content.parts[0].text;
    res.json({ analysis: analysis });
} catch (error) {
    console.error('Error analyzing this document: ', error);
    res.status(500).json({ error: 'Failed to analyze document. '});
}
});
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});