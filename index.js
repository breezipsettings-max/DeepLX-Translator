const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Main Translation Endpoint
app.post('/translate', async (req, res) => {
    const { text, source_lang, target_lang } = req.body;

    // Safety check
    if (!text || !target_lang) {
        return res.status(400).json({ code: 400, message: "Missing text or target_lang" });
    }

    try {
        // Calling the DeepLX Engine
        const response = await axios.post('https://deeplx.owo.network/translate', {
            text: text,
            source_lang: source_lang || "auto",
            target_lang: target_lang
        });

        // Send the translated text back to Roblox
        res.json({
            code: 200,
            data: response.data.data
        });

    } catch (error) {
        console.error("Translation Error:", error.message);
        res.status(500).json({ code: 500, message: "Translation failed" });
    }
});

// Health check to keep the server alive
app.get('/', (req, res) => {
    res.send("Translator Server is Running! 🚀");
});

app.listen(PORT, () => {
    console.log(`Server is live on port ${PORT}`);
});
