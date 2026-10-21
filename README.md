# 🚜 AgroStock

O **AgroStock** é uma aplicação web desenvolvida para a gestão e controlo de stock de insumos agrícolas, permitindo o cadastro, edição, eliminação e acompanhamento de produtos e utilizadores.

---

## 🛠️ Tecnologias Utilizadas

- **Framework Web:** [Next.js](https://nextjs.org/) (App Router)
- **Biblioteca UI:** [React](https://react.dev/)
- **Linguagem:** JavaScript / JSX
- **Estilização:** CSS / Tailwind CSS
- **Banco de Dados:** MariaDB / MySQL (conexão via `mysql2`)
- **Ambiente de Desenvolvimento:** Node.js

---

## 📂 Estrutura do Projeto

```text
agrostock/
├── public/          # Ficheiros estáticos e ícones
├── src/
│   ├── app/         # Rotas e Páginas (App Router)
│   │   ├── admin/   # Gestão de utilizadores
│   │   ├── api/     # Endpoints da API REST (Auth, Stock, Produtos)
│   │   ├── dashboard/# Painel principal e formulários de insumos
│   │   ├── login/   # Ecrã de autenticação
│   │   └── cadastro/# Ecrã de registo
│   └── lib/         # Ligação à base de dados (db.js)
├── database.sql     # Script de criação e estrutura da base de dados
└── package.json     # Dependências e scripts do projeto