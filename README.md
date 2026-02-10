# Cogitari Audit Tool 🛡️

Ferramenta oficial de auditoria técnica, compliance e gestão de riscos desenvolvida pela **Cogitari Tech** (CNPJ: 64.460.886/0001-39).
Esta aplicação Single-Page (SPA) permite a criação ágil de relatórios de auditoria padronizados, garantindo rastreabilidade das ações dos auditores e impondo regras de negócio estritas para a geração de artefatos finais.

## 🚀 Funcionalidades Principais

### 🔍 Motor de Auditoria

- **Registro Granular:** Classificação detalhada de achados por Risco (Crítico a Baixo), Status (Pendente a Bloqueado) e Impacto (Segurança, Operacional, Jurídico, Privacidade).
- **Tipos de Task:** Categorização técnica para facilitar a criação de tickets (ex: Frontend Bug, Security Vuln, DevOps Failure).
- **Evidências Ricas:** Suporte para upload de imagens (prints), inserção de links de referência e Blocos de Código/Logs com formatação dedicada.

### 🔐 Compliance & Segurança (Regras de Negócio)

- **Assinatura Viva (Traceability):** O relatório não pode ser gerado sem assinaturas. A assinatura é registrada automaticamente baseada na ação do auditor (editar, adicionar achado) ou manualmente via botão "Assinar Agora".
- **Regra da Segunda-Feira:** A data final da auditoria ("Fim") é validada via código e deve obrigatoriamente ser uma Segunda-feira, alinhando-se aos ciclos de sprint da Cogitari.
- **Bloqueio de Exportação:** O sistema impede a geração de PDF ou envio para o Drive se houver pendências de assinatura ou datas inválidas.

### 💾 Persistência e Exportação

- **Auto-Save Inteligente:** O estado da auditoria é salvo no localStorage a cada interação. O trabalho não é perdido se a aba for fechada.
- **Google Drive Sync:** Integração via OAuth 2.0 para converter o relatório HTML em um Google Doc editável na nuvem da empresa.
- **Geração de PDF:** Motor html2pdf.js para gerar arquivos imutáveis e prontos para assinatura digital final.
- **Exportação Multi-Formato:** Suporte para saída em PDF, DOCX (HTML), TXT e JSON.

### 🧪 Funcionalidades Beta (Mockups)

- **Integração GitHub:** Interface simulada para conectar a auditoria a repositórios, branches e commits específicos da organização.
- **Automação de E-mail:** Interface para notificação automática dos responsáveis técnicos por achado.

## 🛠️ Stack Tecnológica

O projeto foi desenhado para ser agnóstico de infraestrutura (Serverless/Client-side only), garantindo portabilidade total.

- **Core:** HTML5 Semântico, Vanilla JavaScript (ES6+)
- **UI Framework:** TailwindCSS (via CDN)
- **Bibliotecas:**
  - html2pdf.js: Renderização de PDF no cliente
  - Google Identity Services (GIS): Autenticação e Drive API

## 💻 Configuração e Instalação

### Pré-requisitos

- Um navegador moderno (Chrome, Edge, Brave)
- Para a função "Salvar no Drive": Um Client ID do Google Cloud configurado

### Setup Local

Clone o repositório:

```sh
git clone https://github.com/cogitari-tech/Audit-Tool.git
cd Audit-Tool
```

**Configuração de Credenciais (Opcional):**
Para habilitar a sincronização com o Google Drive, edite o arquivo `src/auditoria_editor.html`:

```js
// Linha ~680
const CLIENT_ID = "SEU_CLIENT_ID_DO_GCP_AQUI";
const SCOPES = "https://www.googleapis.com/auth/drive.file";
```

> **Nota:** Sem o Client ID, a geração de PDF e o Auto-Save local continuam funcionando normalmente.

### Execução

- Abra o arquivo `.html` diretamente no navegador.
- **Recomendado:** Utilize a extensão Live Server no VS Code.

## 📋 Fluxo de Utilização

1. **Início:** Preencha os dados do Cliente, Projeto e Datas.
2. **Seleção de Auditor:** Selecione seu nome no campo "Auditor Ativo" no topo da página. Isso vinculará suas ações à sua assinatura.
3. **Registro:** Utilize o botão "+ Novo Achado" para documentar ocorrências.
4. Anexe prints.
5. Cole logs de erro no bloco de código.
6. Defina Risco e Impacto.
7. **Validação:** Verifique se a seção "4. Assinaturas" no rodapé foi populada automaticamente com suas ações.
8. **Exportação:** Clique em "Salvar" ou "PDF". O sistema validará as regras de compliance antes de liberar o arquivo.

## 🤝 Contribuição

Consulte o arquivo [CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes sobre nosso fluxo de branches (`feature/* -> develop -> main`) e padrões de commit.

## 📄 Licença

Proprietário. Copyright © 2026 Cogitari Tech (CNPJ: 64.460.886/0001-39).
Ferramenta de uso interno restrito. A distribuição não autorizada é proibida.
