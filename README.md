# FbgaminGGMAX - Perplexity Code Monitor (Vercel)

Versão otimizada para hospedar na Vercel.

## 📁 Estrutura

```
fbgaming-vercel/
├── index.html          # Site (HTML + CSS + JS)
├── api/
│   ├── codes.js        # Endpoint /api/codes
│   └── health.js       # Endpoint /api/health
├── vercel.json         # Configuração Vercel
├── package.json        # Dependências
└── README.md           # Este arquivo
```

## 🚀 Deploy na Vercel

### Opção 1: Via GitHub (Recomendado)

1. Faça upload dos arquivos para um repositório GitHub
2. Acesse https://vercel.com
3. Clique em "New Project"
4. Selecione seu repositório
5. Clique em "Deploy"

### Opção 2: Via Vercel CLI

```bash
npm install -g vercel
vercel
```

### Opção 3: Drag & Drop

1. Acesse https://vercel.com/new
2. Arraste a pasta para fazer upload
3. Clique em "Deploy"

## ✨ Funcionalidades

✅ Monitora códigos do mail.tm
✅ Atualiza a cada 10 segundos
✅ Copia código com um clique
✅ Deleta códigos manualmente
✅ Aviso de exclusão automática
✅ Interface moderna roxo/preto
✅ Sem dependências externas

## 🔧 Configuração

As credenciais já estão configuradas em `api/codes.js`:
- Email: `fbgaminggmax@tiffincrane.com`
- Senha: `FBGAMINGGMAX`

Para mudar, edite `api/codes.js`:
```javascript
const MAIL_TM_EMAIL = 'seu-email@tiffincrane.com';
const MAIL_TM_PASSWORD = 'sua-senha';
```

## 📊 Endpoints

- `GET /` - Retorna o site HTML
- `GET /api/codes` - Retorna todos os códigos
- `GET /api/health` - Verifica saúde do servidor

## 🌐 URL de Acesso

Após deploy, seu site estará em:
```
https://seu-projeto.vercel.app
```

## 📝 Notas

- Vercel é gratuito para projetos pessoais
- Não precisa de banco de dados
- Códigos expiram após 24 horas
- Deletados não voltam (localStorage)
- Atualização automática a cada 10 segundos

## 💡 Dicas

- Use variáveis de ambiente para credenciais (recomendado)
- Configure domínio customizado nas configurações do projeto
- Monitore logs em https://vercel.com/dashboard

## 🆘 Troubleshooting

**Erro 500 ao buscar códigos:**
- Verifique credenciais do mail.tm
- Verifique conexão com internet
- Veja logs em Vercel Dashboard

**Códigos não aparecem:**
- Clique em "Atualizar"
- Verifique se há mensagens no mail.tm
- Verifique console do navegador (F12)

## 📞 Suporte

Para problemas, verifique:
1. Se as credenciais estão corretas
2. Se há mensagens no mail.tm
3. Os logs do Vercel Dashboard

