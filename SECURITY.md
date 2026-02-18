# Política de Segurança

A Cogitari Tech leva a segurança a sério. Nossa plataforma de auditoria foi desenhada com princípios de **Privacy by Design**, **Zero Trust** e **Defense in Depth**.

## 🔒 Arquitetura e Dados

**Híbrida (Client + Supabase):**

- **Frontend (Web)**: Processamento local e interface segura via React/Vite.
- **Backend (Supabase)**: Banco de dados PostgreSQL com isolamento rigoroso de tenants via **Row Level Security (RLS)**.
- **Autenticação**: Gerenciada pelo Supabase Auth (JWT), garantindo que cada requisição seja verificada.

## 🛡️ Medidas de Proteção

Implementamos diversas camadas de segurança no ciclo de desenvolvimento:

1.  **Row Level Security (RLS)**:
    - Cada transação, conta ou auditoria é estritamente isolada.
    - Usuários só acessam dados que possuem permissão explícita.

2.  **Pre-commit Hooks (Husky)**:
    - **Secret Scanning**: Bloqueio automático de commits contendo chaves de API ou segredos.
    - **Arquivos .env**: Bloqueio de arquivos de ambiente.
    - **Auditoria de Dependências**: Verificação automática de vulnerabilidades (`npm audit`) antes de cada commit.

3.  **Integrações Seguras**:
    - **Google Drive**: Escopo restrito (`drive.file`) - acesso apenas a arquivos criados pela própria ferramenta.

## 🐛 Reportar uma Vulnerabilidade

Se descobrir uma falha de segurança, **NÃO** abra uma Issue pública.

Envie um e-mail para nossa equipe de segurança:

- **E-mail:** devops@amuri.app
- **Assunto:** [SECURITY] Audit Tool Vulnerability

Tentaremos responder em até 24 horas úteis.

---

Cogitari Tech — Secure by default.
