const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 4000;

const AUTH_TOKEN = "Translator";

app.use(express.json());

app.post('/', async (req, res) => {
    const { text, source_lang, target_lang } = req.body;
    const authHeader = req.headers['authorization'];

    if (!authHeader || authHeader !== `Bearer ${AUTH_TOKEN}`) {
        return res.status(401).json({ code: 401, message: "Unauthorized" });
    }

    try {
        const response = await axios.post('https://deeplx-translator.onrender.com/', {
            text: text,
            source_lang: source_lang || "auto",
            target_lang: target_lang
        }, { timeout: 5000 });

        res.json({
            code: 200,
            data: response.data.data,
            source_lang: (response.data.source_lang || "auto").toUpperCase()
        });
    } catch (e) {
        res.status(502).json({ code: 502, message: "DeepLX Backend Error" });
    }
});

app.get('/', (req, res) => {
    res.send('DeepLX Translator is Online');
});

app.listen(PORT, () => console.log(`Translator listening on ${PORT}`));
