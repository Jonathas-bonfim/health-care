# Sistema de Saúde - Health Care

Sistema médico para gerenciamento de atendimentos, pacientes, medicamentos e exames.

## Tecnologias

- **React 19** com TypeScript
- **Vite** para build e desenvolvimento
- **Firebase Firestore** para armazenamento de dados
- **TanStack Query (React Query)** para gerenciamento de estado e cache
- **Tailwind CSS** para estilização

## Funcionalidades

### Atendimentos
- Listagem de atendimentos com filtros por data (inicial/final) e paciente
- Criação, edição, visualização e exclusão de atendimentos
- Modal completo com:
  - Dados básicos (paciente, data, observação)
  - Exame físico completo (pressão, peso, altura, IMC, temperatura, glicemia, saturação, etc.)
  - Seleção de medicamentos
  - Seleção de exames

### Pacientes
- CRUD completo de pacientes
- Busca por número e nome

### Medicamentos
- CRUD completo de medicamentos
- Busca e seleção no atendimento

### Exames
- CRUD completo de exames
- Busca e seleção no atendimento

## Configuração

### 1. Instalar dependências

```bash
pnpm install
```

### 2. Configurar Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative o Firestore Database
3. Copie as credenciais do projeto
4. Crie um arquivo `.env` na raiz do projeto `front-end`:

```env
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-auth-domain
VITE_FIREBASE_PROJECT_ID=seu-project-id
VITE_FIREBASE_STORAGE_BUCKET=seu-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=seu-messaging-sender-id
VITE_FIREBASE_APP_ID=seu-app-id
```

### 3. Executar o projeto

```bash
pnpm dev
```

O projeto estará disponível em `http://localhost:5173`

## Estrutura do Projeto

```
src/
├── components/
│   ├── ui/              # Componentes reutilizáveis (Modal, Button, Input, etc.)
│   ├── crud/            # Modais de CRUD (Paciente, Medicamento, Exame)
│   └── atendimentos/    # Componentes de atendimentos
├── hooks/               # Hooks do React Query
├── pages/               # Páginas principais
├── services/            # Serviços de integração com Firebase
├── types/               # Tipos TypeScript
└── config/              # Configurações (Firebase)
```

## Funcionalidades Detalhadas

### Exame Físico
- **Pressão Arterial**: Sistólica e Diastólica
- **Peso e Altura**: Cálculo automático de IMC
- **Temperatura**: Em graus Celsius
- **Glicemia**: Com momento da coleta (Jejum, Pós-prandial, Pré-prandial, Não identificado)
- **Saturação**: Em porcentagem
- **Circunferência Abdominal**: Em centímetros
- **Frequência Cardíaca**: Em bpm
- **Frequência Respiratória**: Em rpm

### Observações
- Campo de texto livre com limite de 500 caracteres
- Contador de caracteres em tempo real

## Desenvolvimento

### Build para produção

```bash
pnpm build
```

### Preview da build

```bash
pnpm preview
```

## Licença

Este projeto foi desenvolvido para uso médico pessoal.
