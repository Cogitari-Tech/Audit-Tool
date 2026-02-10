git clone [https://github.com/cogitari-tech/Audit-Tool.git](https://github.com/cogitari-tech/Audit-Tool.git)

# Guia de Contribuição - Cogitari Audit Tool

Obrigado por contribuir para a manutenção das ferramentas internas da **Cogitari Tech** (CNPJ: 64.460.886/0001-39). Como somos uma equipe enxuta focada em Cybersecurity e Eficiência, seguimos diretrizes rígidas para manter este projeto estável.

---

## 💻 Configuração do Ambiente Local

Para baixar o código e começar a desenvolver na sua máquina:

**Clone o Repositório:**

```sh
git clone https://github.com/cogitari-tech/Audit-Tool.git
cd Audit-Tool
```

---

## 🔑 Configuração de Credenciais (Google Drive)

Para testar a funcionalidade de sincronização com a nuvem, é necessário configurar o `CLIENT_ID`.

1. Abra o arquivo principal (`src/index.html` ou `auditoria_editor.html`).
2. Localize a linha:
   ```js
   const CLIENT_ID = "";
   ```
3. Insira o ID do projeto amuri-platform (GCP) ou solicite uma credencial de desenvolvimento ao Tech Lead.

> **Nota:** Sem isso, o botão "Salvar no Drive" emitirá um alerta, mas a geração de PDF continuará funcionando normalmente.

---

## 🚀 Execução

Como o projeto é uma SPA (Single Page Application) sem dependências de build (Node.js/Webpack), você pode simplesmente abrir o arquivo `.html` no seu navegador.

**Recomendado:** Utilize a extensão Live Server no VS Code para ter hot-reload (atualização automática) enquanto edita o código.

---

## 🛠️ Fluxo de Desenvolvimento

Utilizamos um pipeline de branches rigoroso para garantir a estabilidade do produto. Siga a esteira abaixo para promover seu código:

### Desenvolvimento (Local & Remoto)

```sh
git checkout -b <seu-nick>/nome-da-feature
# (Faça suas alterações)
git add .
git commit -m "feat: descrição da feature"
git push origin <seu-nick>/nome-da-feature
```

### Integração Contínua (Develop)

Abra um Pull Request (PR) da sua branch para a `develop`.

> **Objetivo:** Execução de testes automatizados e linting. O merge só ocorre se o CI passar.

### Homologação (Beta)

Após o merge na `develop`, abra um PR para a branch `beta`.

> **Objetivo:** Testes manuais e validação de QA.

### Correção de Bugs (Hotfix Loop)

Se houver bugs em Beta:

```sh
# Corrija na branch hotfix e faça PR de volta para beta
```

---

## 🚢 Lançamento (Release/Main)

Se a versão em beta estiver estável, abra o PR para `release` (pré-lançamento) ou `main` (produção).

---

## 📝 Padrão de Commits

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/). Mantenha o histórico limpo.

Exemplos:

```sh
feat: adiciona campo de data de correção
fix: corrige alinhamento do checkbox no mobile
docs: atualiza readme com novo client_id
security: atualiza escopos do google drive
```

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
