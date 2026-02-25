module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { model, messages, max_tokens } = req.body;

    if (!model || !messages) {
        return res.status(400).json({ error: 'Missing required fields: model, messages' });
    }

    const isGemini = model.startsWith('gemini-');
    const endpoint = isGemini
        ? 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions'
        : 'https://api.openai.com/v1/chat/completions';
    const apiKey = isGemini
        ? process.env.GEMINI_API_KEY
        : process.env.OPENAI_API_KEY;

    try {
        const apiResponse = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({ model, messages, max_tokens })
        });

        const data = await apiResponse.json();
        return res.status(apiResponse.status).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
