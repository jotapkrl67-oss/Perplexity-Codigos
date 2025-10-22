// Credenciais do mail.tm
const MAIL_TM_EMAIL = 'fbgaminggmax@tiffincrane.com';
const MAIL_TM_PASSWORD = 'FBGAMINGGMAX';

// Função para extrair código do HTML
function extractCodeFromHtml(html) {
    if (!html) return null;

    let decoded = html.replace(/=([0-9A-F]{2})/gi, (match, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
    });

    let tokenMatch = decoded.match(/token[=:]\s*([0-9]{6})/);
    if (tokenMatch) {
        return tokenMatch[1];
    }

    let codeMatch = decoded.match(/code[=:]\s*([0-9]{6})/);
    if (codeMatch) {
        return codeMatch[1];
    }

    let verificationMatch = decoded.match(/verificacao[:\s]+([0-9]{6})/i);
    if (verificationMatch) {
        return verificationMatch[1];
    }

    let anyMatch = decoded.match(/(\d{6})/);
    if (anyMatch) {
        return anyMatch[1];
    }

    return null;
}

export default async function handler(req, res) {
    // Habilitar CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // 1. Fazer login no mail.tm
        const loginResponse = await fetch('https://api.mail.tm/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                address: MAIL_TM_EMAIL,
                password: MAIL_TM_PASSWORD,
            }),
        });

        if (!loginResponse.ok) {
            throw new Error(`Login failed: ${loginResponse.status}`);
        }

        const loginData = await loginResponse.json();
        const token = loginData.token;

        // 2. Buscar mensagens
        const messagesResponse = await fetch('https://api.mail.tm/messages?limit=50', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!messagesResponse.ok) {
            throw new Error(`Failed to fetch messages: ${messagesResponse.status}`);
        }

        const messagesData = await messagesResponse.json();
        const messages = messagesData['hydra:member'] || [];

        // 3. Extrair códigos de cada mensagem
        const enrichedMessages = [];

        for (const msg of messages) {
            try {
                const sourceResponse = await fetch(
                    `https://api.mail.tm/sources/${msg.id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );

                if (sourceResponse.ok) {
                    const sourceData = await sourceResponse.json();
                    const htmlContent = sourceData.data || '';
                    const extractedCode = extractCodeFromHtml(htmlContent);

                    if (extractedCode) {
                        enrichedMessages.push({
                            id: msg.id,
                            subject: msg.subject,
                            createdAt: msg.createdAt,
                            code: extractedCode,
                        });
                    }
                }
            } catch (e) {
                console.error(`Error fetching source for ${msg.id}:`, e.message);
            }
        }

        res.status(200).json(enrichedMessages);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
}

