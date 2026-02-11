const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.post('/translate', async (req, res) => {
    const { text, source_lang, target_lang } = req.body;

    if (!text || !target_lang) {
        return res.status(400).json({ code: 400, message: "Missing text or target_lang" });
    }

    try {
        const response = await axios.post('https://deeplx.owo.network/translate', {
            text: text,
            source_lang: source_lang || "auto",
            target_lang: target_lang
        }, { timeout: 5000 });

        res.json({
            code: 200,
            data: response.data.data,          
            source_lang: response.data.source_lang 
        });

    } catch (error) {
        console.error("DeepLX Error:", error.message);
        res.status(500).json({ code: 500, data: text, message: "Engine error" });
    }
});

app.get('/', (req, res) => {
    res.send('DeepLX Translator is Online');
});

app.listen(PORT, () => {
    console.log(`Translator listening on port ${PORT}`);
});
