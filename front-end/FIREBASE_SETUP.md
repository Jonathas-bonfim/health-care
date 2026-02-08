# Guia de Configuração do Firebase

Este guia vai te ajudar a configurar o Firebase para o sistema de saúde.

## Passo 1: Criar Projeto no Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Adicionar projeto"** ou **"Create a project"**
3. Preencha o nome do projeto (ex: "health-care" ou "sistema-saude")
4. Clique em **"Continuar"**
5. (Opcional) Desative o Google Analytics se não quiser usar
6. Clique em **"Criar projeto"**
7. Aguarde a criação e clique em **"Continuar"**

## Passo 2: Configurar Firestore Database

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Escolha o modo:
   - **Modo de teste**: Permite leitura/escrita **SEM autenticação** por 30 dias (recomendado para desenvolvimento)
   - **Modo de produção**: Mais seguro, requer regras de segurança
4. Escolha a localização do banco (ex: `southamerica-east1` para Brasil)
5. Clique em **"Ativar"**

### ⚠️ Importante sobre Autenticação

**NÃO é necessário implementar autenticação de usuário para o sistema funcionar!**

- **Modo de Teste**: Funciona sem autenticação por 30 dias
- **Regras de Segurança**: Você pode configurar para permitir acesso sem autenticação

### Configurar Regras de Segurança (Após 30 dias ou Modo de Produção)

Se você escolheu **modo de produção** ou o **modo de teste expirou**, configure as regras:

1. No Firestore, vá em **"Regras"**
2. Cole as regras abaixo (permite acesso sem autenticação):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ Permite acesso SEM autenticação
    }
  }
}
```

3. Clique em **"Publicar"**

⚠️ **ATENÇÃO**: 
- Essas regras permitem acesso total **sem autenticação**
- Funciona perfeitamente para uso pessoal/privado
- **NÃO use** se o app for público ou acessível na internet
- Para produção pública, implemente autenticação e regras adequadas

## Passo 3: Obter Credenciais do Firebase

1. No Firebase Console, clique no ícone de **engrenagem** (⚙️) ao lado de "Visão geral do projeto"
2. Clique em **"Configurações do projeto"**
3. Role até a seção **"Seus aplicativos"**
4. Clique no ícone **`</>`** (Web) para adicionar um app web
5. Preencha:
   - **Apelido do app**: "Health Care Web" (ou qualquer nome)
   - **Firebase Hosting**: Pode deixar desmarcado por enquanto
6. Clique em **"Registrar app"**
7. **Copie as credenciais** que aparecem (firebaseConfig)

Você verá algo assim:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Passo 4: Configurar Variáveis de Ambiente

1. Na raiz do projeto `front-end`, crie um arquivo chamado `.env`:

```bash
cd front-end
touch .env
```

2. Abra o arquivo `.env` e cole as credenciais no seguinte formato:

```env
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Importante**: 
- Substitua os valores pelos seus dados reais
- Não use aspas nos valores
- Não deixe espaços antes ou depois do `=`

## Passo 5: Verificar Configuração

1. Reinicie o servidor de desenvolvimento:
```bash
pnpm dev
```

2. Abra o console do navegador (F12)
3. Se tudo estiver correto, você não verá erros relacionados ao Firebase

## Estrutura das Coleções no Firestore

O sistema criará automaticamente as seguintes coleções:

- `pacientes` - Dados dos pacientes
- `medicamentos` - Lista de medicamentos
- `exames` - Lista de exames
- `atendimentos` - Registros de atendimentos

## Solução de Problemas

### Erro: "Firebase: Error (auth/unauthorized-domain)"
- Adicione seu domínio nas configurações do Firebase:
  - Firebase Console → Authentication → Settings → Authorized domains
  - Adicione `localhost` para desenvolvimento

### Erro: "Missing or insufficient permissions"
- Verifique as regras do Firestore
- Para desenvolvimento, use as regras temporárias mencionadas acima

### Variáveis de ambiente não funcionam
- Certifique-se de que o arquivo está na raiz de `front-end/`
- Certifique-se de que as variáveis começam com `VITE_`
- Reinicie o servidor de desenvolvimento após criar/editar o `.env`

## Próximos Passos

Após configurar o Firebase:
1. Teste criando um paciente
2. Teste criando um atendimento
3. Verifique se os dados aparecem no Firestore Console
