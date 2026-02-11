const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 8080;

-- Authorization Token
const AUTH_TOKEN = "Translator";

app.use(express.json());

-- Handle POST requests at the ROOT (/)
app.post('/', async (req, res) => {
    const { text, source_lang, target_lang } = req.body;
    const authHeader = req.headers['authorization'];

    if (!authHeader || authHeader !== `Bearer ${AUTH_TOKEN}`) {
        return res.status(401).json({ code: 401, message: "Unauthorized" });
    }

    try {
        -- Using a reliable backend to actually get the translation
        const response = await axios.post('https://deeplx.missuo.ru/translate', {
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

-- Handle GET requests at ROOT (/) so it shows online in browser
app.get('/', (req, res) => {
    res.send('DeepLX Translator is Online at Root');
});

app.listen(PORT, () => console.log(`Translator listening on ${PORT}`));
