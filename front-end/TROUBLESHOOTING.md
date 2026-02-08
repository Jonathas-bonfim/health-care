# Solução de Problemas - Firestore

## Problema: Não consigo cadastrar pacientes/medicamentos/exames

### ✅ Você NÃO precisa criar coleções manualmente!

As coleções são criadas **automaticamente** quando você insere o primeiro documento.

### 🔍 Verificações Necessárias

#### 1. Verificar Regras de Segurança do Firestore

O problema mais comum é que as **regras de segurança** estão bloqueando a escrita.

**Como verificar:**
1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá em **Firestore Database** → **Regras**
4. Verifique as regras atuais

**Regras corretas (sem autenticação):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Como corrigir:**
1. Cole as regras acima na aba "Regras"
2. Clique em **"Publicar"**
3. Aguarde alguns segundos
4. Tente cadastrar novamente

#### 2. Verificar Variáveis de Ambiente

Certifique-se de que o arquivo `.env` está configurado corretamente:

1. O arquivo deve estar em: `front-end/.env`
2. Deve conter todas as variáveis:
   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
3. **Reinicie o servidor** após criar/editar o `.env`:
   ```bash
   # Pare o servidor (Ctrl+C) e inicie novamente
   pnpm dev
   ```

#### 3. Verificar Console do Navegador

1. Abra o console do navegador (F12)
2. Tente cadastrar um paciente
3. Veja se há erros no console

**Erros comuns:**

- **"Missing or insufficient permissions"**
  → Problema nas regras de segurança (veja item 1)

- **"Firebase: Error (auth/unauthorized-domain)"**
  → Adicione `localhost` nas configurações:
     - Firebase Console → Authentication → Settings → Authorized domains
     - Adicione `localhost`

- **"Firebase App named '[DEFAULT]' already exists"**
  → Recarregue a página (F5)

#### 4. Verificar se o Firestore está Ativo

1. Firebase Console → Firestore Database
2. Verifique se o banco está criado e ativo
3. Se não estiver, crie seguindo o guia `FIREBASE_SETUP.md`

### 📋 Checklist Rápido

- [ ] Firestore Database criado e ativo
- [ ] Regras de segurança permitem leitura/escrita (`allow read, write: if true`)
- [ ] Arquivo `.env` criado na raiz de `front-end/`
- [ ] Todas as variáveis de ambiente preenchidas corretamente
- [ ] Servidor reiniciado após criar/editar `.env`
- [ ] Sem erros no console do navegador
- [ ] `localhost` adicionado nos domínios autorizados (se necessário)

### 🆘 Ainda não funciona?

1. **Abra o console do navegador (F12)**
2. **Tente cadastrar um paciente**
3. **Copie a mensagem de erro completa**
4. **Verifique o console do Firebase:**
   - Firebase Console → Firestore Database → Uso
   - Veja se há tentativas de escrita sendo bloqueadas

### 💡 Dica

Se você escolheu **"Modo de teste"** ao criar o Firestore, ele funciona por 30 dias sem regras. Após 30 dias, você precisa configurar as regras manualmente.
