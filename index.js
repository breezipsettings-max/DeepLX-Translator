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

        // IMPORTANT: Send the WHOLE data object back so Roblox sees source_lang
        res.json({
            code: 200,
            data: response.data.data,          // The translated text
            source_lang: response.data.source_lang // The original language
        });

    } catch (error) {
        res.status(500).json({ code: 500, data: text, message: "Engine error" });
    }
});
