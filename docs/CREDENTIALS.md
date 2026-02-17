# 🔐 Guia de Credenciais e Configuração de Ambiente

Este documento descreve detalhadamente todas as credenciais necessárias para executar o projeto **Cogitari Audit Platform**, tanto localmente quanto nos ambientes Beta e Produção.

> **⚠️ IMPORTANTE**: Nunca commite arquivos `.env` reais no Git. Use apenas `.env.example` como modelo.

---

## 1. Supabase (Backend & Database)

O Supabase fornece o banco de dados PostgreSQL, autenticação e APIs em tempo real.

### Credenciais Necessárias

| Variável                    | Descrição                              | Onde encontrar?                                           |
| --------------------------- | -------------------------------------- | --------------------------------------------------------- |
| `VITE_SUPABASE_URL`         | URL pública da API REST                | Dashboard > Settings > API > Project URL                  |
| `VITE_SUPABASE_ANON_KEY`    | Chave pública (segura para Frontend)   | Dashboard > Settings > API > `anon` public                |
| `SUPABASE_SERVICE_ROLE_KEY` | **SECRETA**: Acesso admin (ignora RLS) | Dashboard > Settings > API > `service_role` secret        |
| `MCP_SERVER_POSTGRES_DSN`   | String de conexão direta com DB        | Dashboard > Settings > Database > Connection String > URI |

### Como obter:

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard).
2. Selecione o projeto (Beta: `audit-tool-beta`, Prod: `audit-tool-prod`).
3. Vá para **Project Settings** (ícone de engrenagem).
4. Para chaves de API: Clique em **API**.
5. Para Banco de Dados: Clique em **Database** → **Connection String**.

> **Nota para MCP**: O `SUPABASE_SERVICE_ROLE_KEY` é muitas vezes necessário para ferramentas de IA/MCP que precisam administrar o banco ou ignorar políticas de segurança para manutenção.

---

## 4. Google Cloud (Phase 2 - Deferred)

**Status:** Adiado para a Fase 2 (Pós-MVP).
A integração com Google Drive e Sheets foi removida do escopo inicial para simplificar a arquitetura.

> Os placeholders `VITE_GOOGLE_CLIENT_ID` e relacionados foram removidos dos arquivos `.env` para evitar confusão.

---

Necessário para que ferramentas de automação (MCP) e scripts interajam com o repositório.

### Credenciais Necessárias

| Variável       | Descrição                     | Onde encontrar?                        |
| -------------- | ----------------------------- | -------------------------------------- |
| `GITHUB_TOKEN` | Personal Access Token (PAT)   | GitHub > Settings > Developer settings |
| `GITHUB_ACTOR` | Seu nome de usuário do GitHub | Seu perfil                             |

### Como obter o `GITHUB_TOKEN` (Passo a Passo):

Recomendamos um **Classic Token** para maior compatibilidade com ferramentas de CLI antigas, ou **Fine-grained** para segurança.

#### Opção A: Token Clássico (Mais compatível)

1. Vá para [Developer Settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens).
2. Clique em **Generate new token (classic)**.
3. **Note**: Dê um nome descritivo (ex: "Amuri Audit MCP").
4. **Expiration**: Defina para 30 ou 90 dias (ou "No expiration" se for para máquina segura).
5. **Scopes (Permissões)** - Marque estas caixas:
   - [x] `repo` (Acesso total a repositórios privados)
   - [x] `workflow` (Para acionar GitHub Actions)
   - [x] `read:user`
   - [x] `project` (Se usar GitHub Projects)
6. Clique em **Generate token**.
7. **COPIE IMEDIATAMENTE**. Você não verá esse token novamente.

#### Opção B: Fine-grained Token (Mais seguro)

1. Vá para [Personal access tokens > Fine-grained tokens](https://github.com/settings/tokens?type=beta).
2. **Resource owner**: Sua conta ou organização (Cogitari-Tech).
3. **Repository access**: "All repositories" ou selecione `Amuri-Audit`.
4. **Permissions**:
   - `Contents`: Read and Write
   - `Metadata`: Read-only
   - `Actions`: Read and Write (se precisar rodar workflows)
   - `Pull Requests`: Read and Write

---

## 3. Estrutura dos Arquivos `.env`

Cada arquivo deve seguir este padrão. Copie do `.env.example` e preencha.

### `.env.beta` / `.env.production`

Arquivos mestres que guardam as credenciais reais de cada ambiente (MANTENHA SEGURO).

```ini
# Supabase - Frontend
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

# Backend / Ferramentas MCP
SUPABASE_URL=...             # (Igual ao VITE_SUPABASE_URL)
SUPABASE_ANON_KEY=...        # (Igual ao VITE_SUPABASE_ANON_KEY)
SUPABASE_SERVICE_ROLE_KEY=... # (Opcional para Dev, Obrigatório para Admin)

# GitHub
GITHUB_TOKEN=ghp_...
GITHUB_ACTOR=seu-usuario
```

### `apps/web/.env`

Arquivo usado pelo Frontend (`npm run dev`). Deve conter APENAS as chaves públicas `VITE_`.

---

## 5. Model Context Protocol (MCP)

Variáveis gerais para servidores MCP.

```ini
MCP_LOG_LEVEL=info
# Exemplo para servidor Postgres direto
MCP_SERVER_POSTGRES_DSN=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
```
