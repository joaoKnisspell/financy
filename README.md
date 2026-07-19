# Financy

Financy é uma aplicação de controle financeiro pessoal, onde é possível gerenciar transações (receitas e despesas) organizadas por categorias personalizadas, com um dashboard para acompanhar o resumo das finanças.

O projeto é dividido em dois módulos:

- **financy-backend** — API GraphQL (Node.js, Express, Apollo Server, Pothos, Prisma) com autenticação via JWT e banco de dados SQLite.
- **financy-frontend** — Aplicação web (React, Vite, TypeScript, Tailwind CSS) que consome a API GraphQL.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 20 ou superior)
- npm

## Como rodar o backend

```bash
cd financy-backend
npm install
```

Crie um arquivo `.env` a partir do `.env.example` e defina um valor para `JWT_SECRET`:

```bash
cp .env.example .env
```

```
JWT_SECRET=uma-chave-secreta
JWT_EXPIRES_IN=7d
DATABASE_URL="file:./dev.db"
PORT=4000
```

Rode as migrações do banco de dados (Prisma + SQLite):

```bash
npm run prisma:migrate
```

Inicie o servidor em modo desenvolvimento:

```bash
npm run dev
```

A API estará disponível em `http://localhost:4000/graphql`.

## Como rodar o frontend

```bash
cd financy-frontend
npm install
```

Crie um arquivo `.env` a partir do `.env.example`:

```bash
cp .env.example .env
```

```
VITE_BACKEND_URL=http://localhost:4000/graphql
```

Inicie a aplicação em modo desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (porta padrão do Vite).

## Rodando o projeto completo

Para utilizar a aplicação, é necessário ter o backend e o frontend rodando simultaneamente (em terminais separados), seguindo os passos acima.
