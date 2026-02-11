const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit'); // You need to add this to package.json
const app = express();

const PORT = process.env.PORT || 3000;

// Rate Limiter Config: Max 60 requests per minute
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, 
    message: { code: 429, message: "Too many translation requests. Slow down!" },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(express.json());

// Apply limiter only to the translate route
app.use('/translate', limiter);

app.post('/translate', async (req, res) => {
    const { text, source_lang, target_lang } = req.body;

    if (!text || !target_lang) {
        return res.status(400).json({ 
            code: 400, 
            message: "Missing text or target_lang" 
        });
    }

    try {
        const response = await axios.post('https://deeplx.owo.network/translate', {
            text: text,
            source_lang: source_lang || "auto",
            target_lang: target_lang
        }, { timeout: 5000 });

        res.json({
            code: 200,
            data: response.data.data
        });

    } catch (error) {
        console.error("Translation Error:", error.message);
        res.status(500).json({ 
            code: 500, 
            data: text, // Fallback to original text
            message: "Engine error" 
        });
    }
});

app.get('/', (req, res) => {
    res.send("DeepLX Translator + Rate Limiter is Online! 🚀");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
