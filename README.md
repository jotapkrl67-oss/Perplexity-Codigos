# FbgaminGGMAX - Perplexity Code Monitor

Site completo e funcional para monitorar códigos do Perplexity.

## 📁 Arquivos Inclusos

- `index.html` - Site completo (HTML + CSS + JavaScript)
- `server.js` - Backend Node.js/Express
- `package.json` - Dependências
- `README.md` - Este arquivo

## 🚀 Instalação Rápida

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar o servidor
```bash
npm start
```

O site estará disponível em `http://localhost:3000`

## ✨ Funcionalidades

✅ Monitora códigos do mail.tm em tempo real
✅ Copia código com um clique
✅ Deleta códigos manualmente
✅ Aviso automático de exclusão em 5 minutos
✅ Interface moderna roxo/preto
✅ Atualização automática a cada 10 segundos
✅ Persistência de deletados (localStorage)

## 🔧 Configuração

As credenciais já estão configuradas em `server.js`:
- Email: `fbgaminggmax@tiffincrane.com`
- Senha: `FBGAMINGGMAX`

Para mudar, edite em `server.js`:
```javascript
const MAIL_TM_EMAIL = 'seu-email@tiffincrane.com';
const MAIL_TM_PASSWORD = 'sua-senha';
```

## 📊 Endpoints da API

- `GET /api/codes` - Retorna todos os códigos
- `GET /api/health` - Verifica saúde do servidor

## 🌐 Hospedagem

Para hospedar:

1. Faça upload de todos os arquivos
2. Instale Node.js no servidor
3. Execute `npm install`
4. Execute `npm start`
5. Configure um proxy reverso (nginx/Apache) se necessário

## 📝 Notas

- Códigos expiram após 24 horas
- Deletados não voltam (salvos no localStorage)
- Atualização automática a cada 10 segundos
- Sem dependências externas além de Express e CORS

## 💡 Dicas

- Use `npm run dev` para desenvolvimento (com auto-reload)
- Configure `PORT=8000 npm start` para mudar a porta
- Verifique `/api/health` para confirmar que está rodando

