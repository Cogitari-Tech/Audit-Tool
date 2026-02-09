Cogitari Audit Tool 🛡️

Ferramenta interna de auditoria técnica, compliance e gestão de riscos desenvolvida pela Cogitari Tech (CNPJ: 64.460.886/0001-39). Esta aplicação Single-Page (SPA) permite a criação ágil de relatórios de auditoria padronizados para os produtos da holding, com suporte a evidências visuais e sincronização direta com o Google Drive corporativo.

🚀 Funcionalidades

Registro Granular de Achados: Classificação individual de risco (Crítico, Alto, Médio, Baixo) e impacto (Segurança, Operacional, Jurídico, Privacidade).

Gestão de Evidências: Upload de prints/imagens e inserção de links de referência (commits, tickets) diretamente no relatório.

Workflow de Status: Acompanhamento do ciclo de vida da correção (Pendente, Em Andamento, Concluído, Bloqueado).

Integração Google Drive: Conversão automática do relatório HTML para Google Docs editável na nuvem da Cogitari.

Modo Offline: Geração de PDFs prontos para impressão diretamente pelo navegador (Ctrl+P).

Segurança: Execução 100% client-side (nenhum dado passa por servidores intermediários, exceto Google APIs quando solicitado).

🛠️ Stack Tecnológica

Core: HTML5 Semântico, Vanilla JavaScript (ES6+).

Estilização: TailwindCSS (via CDN).

Integração Cloud: Google Identity Services (GIS) & Google Drive API v3.

⚙️ Configuração e Instalação

Como é uma ferramenta interna serverless, não requer npm install ou build steps complexos.

Pré-requisitos

Um navegador moderno (Chrome, Edge, Brave).

Acesso ao Google Workspace da Cogitari (para sincronização com Drive).

Setup Inicial (Desenvolvedores)

Clone o repositório:

git clone [https://github.com/cogitari-tech/Audit-Tool.git](https://github.com/cogitari-tech/Audit-Tool.git)

# Cogitari Audit Tool 🛡️

Ferramenta interna de auditoria técnica, compliance e gestão de riscos desenvolvida pela **Cogitari Tech** (CNPJ: 64.460.886/0001-39).
Esta aplicação Single-Page (SPA) permite a criação ágil de relatórios de auditoria padronizados para os produtos da holding, com suporte a evidências visuais e sincronização direta com o Google Drive corporativo.

---

## 🚀 Funcionalidades

- **Registro Granular de Achados:** Classificação individual de risco (Crítico, Alto, Médio, Baixo) e impacto (Segurança, Operacional, Jurídico, Privacidade).
- **Gestão de Evidências:** Upload de prints/imagens e inserção de links de referência (commits, tickets) diretamente no relatório.
- **Workflow de Status:** Acompanhamento do ciclo de vida da correção (Pendente, Em Andamento, Concluído, Bloqueado).
- **Integração Google Drive:** Conversão automática do relatório HTML para Google Docs editável na nuvem da Cogitari.
- **Modo Offline:** Geração de PDFs prontos para impressão diretamente pelo navegador (Ctrl+P).
- **Segurança:** Execução 100% client-side (nenhum dado passa por servidores intermediários, exceto Google APIs quando solicitado).

---

## 🛠️ Stack Tecnológica

- **Core:** HTML5 Semântico, Vanilla JavaScript (ES6+)
- **Estilização:** TailwindCSS (via CDN)
- **Integração Cloud:** Google Identity Services (GIS) & Google Drive API v3

---

## ⚙️ Configuração e Instalação

Como é uma ferramenta interna serverless, não requer `npm install` ou build steps complexos.

### Pré-requisitos

- Um navegador moderno (Chrome, Edge, Brave)
- Acesso ao Google Workspace da Cogitari (para sincronização com Drive)

### Setup Inicial (Desenvolvedores)

Clone o repositório:

```sh
git clone https://github.com/cogitari-tech/Audit-Tool.git
cd Audit-Tool
```

#### Configuração do Client ID (Google Cloud):

1. Abra o arquivo `src/index.html` (ou `auditoria_editor.html`).
2. Localize a constante no final do script:
   ```js
   const CLIENT_ID = "SEU_CLIENT_ID_AQUI";
   ```
3. Insira o Client ID do projeto amuri-platform (GCP) autorizado para a origem local.

#### Execução

- Abra o arquivo `.html` diretamente no navegador.
- Ou use uma extensão como **Live Server** no VS Code para desenvolvimento.

---

## 📦 Como Utilizar

- **Preenchimento:** Insira os dados da auditoria e utilize o botão "+ Novo Achado" para registrar ocorrências.
- **Evidências:** Anexe imagens de erro ou logs. Elas serão renderizadas no relatório final.

### Exportação

- **Salvar no Drive:** Clique para autenticar e gerar um Doc colaborativo.
- **Gerar PDF:** Clique para baixar a versão imutável assinada digitalmente.

---

## 🤝 Contribuição

Este é um projeto interno. Mudanças estruturais no engine de auditoria devem ser discutidas com o CTO antes do merge. Consulte o arquivo [CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes de código.

---

## 📄 Licença

Proprietário. Copyright © 2026 Cogitari Tech (CNPJ: 64.460.886/0001-39). Todos os direitos reservados.
A cópia, modificação ou distribuição não autorizada deste software é estritamente proibida.
