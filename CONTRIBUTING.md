# Guia de Contribuição - Cogitari Audit Tool

## Obrigado por contribuir para a manutenção das ferramentas internas da Cogitari Tech (CNPJ: 64.460.886/0001-39). Como somos uma equipe enxuta focada em Cybersecurity e Eficiência, seguimos diretrizes rígidas para manter este projeto estável.

## 🛠️ Fluxo de Desenvolvimento

Utilizamos um fluxo simplificado baseado em Feature Branches:
**Crie uma Branch:** Nunca faça commits diretos na `main`.

````sh
git checkout -b feat/nova-funcionalidade
# ou
git checkout -b fix/correcao-bug
**Padrão de Commits:** Utilizamos Conventional Commits. Mantenha o histórico limpo.
Exemplos:
```sh
feat: adiciona campo de data de correção
fix: corrige alinhamento do checkbox no mobile
docs: atualiza readme com novo client_id
security: atualiza escopos do google drive
---
## 🎨 Padrões de Código
Como o projeto é um Single File Component (HTML + JS + CSS em um arquivo):
- **Organização:** Mantenha o CSS no `<head>`, o HTML no `<body>` e o JS no final do `<body>`.
- **Nomenclatura:**
	- Variáveis JS: `camelCase` (ex: `findingCount`).
	- Classes CSS: Utilitários do Tailwind.
---
## 🔒 Segurança
- 🚫 **NUNCA** commite o CLIENT_ID de produção se o repositório for público (atualmente é privado, mas mantenha a higiene).
- 🚫 **NUNCA** utilize `innerHTML` com dados não sanitizados vindos de inputs externos (**XSS Prevention**).
---
## 🧪 Testes
Antes de abrir um Pull Request (PR):
- **Teste de Impressão:** Gere um PDF e verifique se as quebras de página não cortaram nenhum achado ao meio.
- **Teste de API:** Verifique se a integração com o Google Drive está autenticando e criando o arquivo corretamente.
- **Responsividade:** O editor deve ser utilizável em telas menores (tablets), embora o foco seja Desktop.
---
## 📝 Pull Requests
- Descreva claramente o "Porquê" da mudança, não apenas o "O que".
- Vincule a Issue ou a Task do Notion/Jira correspondente.
- Solicite review do @xXYoungMoreXx (CTO) ou do Tech Lead responsável.
---
Cogitari Tech - Ship fast, audit faster.
Guia de Contribuição - Cogitari Audit Tool

Obrigado por contribuir para a manutenção das ferramentas internas da Cogitari Tech (CNPJ: 64.460.886/0001-39). Como somos uma equipe enxuta focada em Cybersecurity e Eficiência, seguimos diretrizes rígidas para manter este projeto estável.

🛠️ Fluxo de Desenvolvimento

Utilizamos um fluxo simplificado baseado em Feature Branches:

Crie uma Branch: Nunca faça commits diretos na main.

git checkout -b feat/nova-funcionalidade
# ou
git checkout -b fix/correcao-bug


Padrão de Commits: Utilizamos Conventional Commits. Mantenha o histórico limpo.

feat: adiciona campo de data de correção

fix: corrige alinhamento do checkbox no mobile

docs: atualiza readme com novo client_id

security: atualiza escopos do google drive

🎨 Padrões de Código

Como o projeto é um Single File Component (HTML + JS + CSS em um arquivo):

Organização: Mantenha o CSS no <head>, o HTML no <body> e o JS no final do <body>.

Nomenclatura:

Variáveis JS: camelCase (ex: findingCount).

Classes CSS: Utilitários do Tailwind.

Segurança:

🚫 NUNCA commite o CLIENT_ID de produção se o repositório for público (atualmente é privado, mas mantenha a higiene).

🚫 NUNCA utilize innerHTML com dados não sanitizados vindos de inputs externos (XSS Prevention).

🧪 Testes

Antes de abrir um Pull Request (PR):

Teste de Impressão: Gere um PDF e verifique se as quebras de página não cortaram nenhum achado ao meio.

Teste de API: Verifique se a integração com o Google Drive está autenticando e criando o arquivo corretamente.

Responsividade: O editor deve ser utilizável em telas menores (tablets), embora o foco seja Desktop.

📝 Pull Requests

Descreva claramente o "Porquê" da mudança, não apenas o "O que".

Vincule a Issue ou a Task do Notion/Jira correspondente.

Solicite review do @xXYoungMoreXx (CTO) ou do Tech Lead responsável.

Cogitari Tech - Ship fast, audit faster.
````
