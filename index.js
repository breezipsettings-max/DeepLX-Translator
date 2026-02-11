const express = require('express');
const axios = require('axios');
const app = express();

// Render uses the PORT environment variable automatically
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Main Translation Route
app.post('/translate', async (req, res) => {
    const { text, source_lang, target_lang } = req.body;

    if (!text || !target_lang) {
        return res.status(400).json({ 
            code: 400, 
            message: "Bad Request: text and target_lang are required." 
        });
    }

    try {
        // Using a reliable DeepLX node with a 5-second timeout
        const response = await axios.post('https://deeplx.owo.network/translate', {
            text: text,
            source_lang: source_lang || "auto",
            target_lang: target_lang
        }, { timeout: 5000 });

        if (response.data && response.data.data) {
            res.json({
                code: 200,
                data: response.data.data,
                source: response.data.source_lang || source_lang
            });
        } else {
            throw new Error("Invalid response from DeepLX engine");
        }

    } catch (error) {
        console.error("Translation Error:", error.message);
        
        // Fallback: Send original text if translation fails so the chat doesn't break
        res.status(500).json({ 
            code: 500, 
            data: text, 
            message: "Translation engine error, returning original text." 
        });
    }
});

// Root route for Render health checks
app.get('/', (req, res) => {
    res.status(200).send("DeepLX Translator is Online at https://deeplx-translator.onrender.com 🚀");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
