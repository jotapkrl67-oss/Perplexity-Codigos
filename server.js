const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

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

// Endpoint para obter códigos
app.get('/api/codes', async (req, res) => {
    try {
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

        res.json(enrichedMessages);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Servir index.html para qualquer rota não encontrada
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 Endpoints:`);
    console.log(`   GET /api/codes - Obter códigos`);
    console.log(`   GET /api/health - Verificar saúde`);
});

