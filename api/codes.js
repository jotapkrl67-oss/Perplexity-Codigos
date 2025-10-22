export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const loginRes = await fetch('https://api.mail.tm/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                address: 'fbgaminggmax@tiffincrane.com',
                password: 'FBGAMINGGMAX'
            })
        });

        const loginData = await loginRes.json();
        const token = loginData.token;

        const messagesRes = await fetch('https://api.mail.tm/messages?limit=50', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const messagesData = await messagesRes.json();
        const messages = messagesData['hydra:member'] || [];

        const codes = [];

        for (const msg of messages) {
            try {
                const sourceRes = await fetch(`https://api.mail.tm/sources/${msg.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (sourceRes.ok) {
                    const sourceData = await sourceRes.json();
                    let html = sourceData.data || '';
                    
                    let decoded = html.replace(/=([0-9A-F]{2})/gi, (m, h) => String.fromCharCode(parseInt(h, 16)));
                    
                    let match = decoded.match(/token[=:]\s*([0-9]{6})/);
                    if (!match) match = decoded.match(/code[=:]\s*([0-9]{6})/);
                    if (!match) match = decoded.match(/(\d{6})/);
                    
                    if (match) {
                        codes.push({
                            id: msg.id,
                            subject: msg.subject,
                            code: match[1],
                            time: new Date(msg.createdAt).toLocaleTimeString('pt-BR')
                        });
                    }
                }
            } catch (e) {
                console.error('Erro:', e);
            }
        }

        res.status(200).json(codes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

