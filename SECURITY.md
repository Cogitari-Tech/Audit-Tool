# Política de Segurança

A Cogitari Tech leva a segurança a sério. Como esta é uma ferramenta de auditoria interna ("Internal Tool"), ela foi desenhada com princípios de **Privacy by Design** e **Zero Trust**.

## 🔒 Arquitetura e Dados

**Modelo Client-Side Only:**

- Todos os dados inseridos, incluindo logs e evidências, são processados exclusivamente na memória do navegador do auditor.
- **Sem Backend:** Não existe base de dados central ou servidor intermediário a recolher os relatórios, exceto quando o auditor opta explicitamente pela integração com o Google Drive.
- **Persistência:** O recurso "Auto-Save" utiliza o localStorage do navegador. Recomenda-se limpar o cache ou usar o botão "Limpar Rascunho" após auditar dados sensíveis em máquinas partilhadas.

## ☁️ Integrações de Terceiros

**Google Drive API:**

- A ferramenta utiliza o escopo `https://www.googleapis.com/auth/drive.file`.
- Isso garante que a aplicação só tem acesso aos ficheiros que ela mesma criou. Não temos acesso a outros documentos do seu Google Drive.

**Bibliotecas Externas (CDN):**

- Utilizamos versões fixas de bibliotecas confiáveis para evitar ataques de Supply Chain:
  - tailwindcss
  - html2pdf.js
  - Google Identity Services

## 🐛 Reportar uma Vulnerabilidade

Se descobrir uma falha de segurança nesta ferramenta, **NÃO** abra uma Issue pública no GitHub.

Envie um e-mail criptografado ou direto para nossa equipe de segurança:

- **E-mail:** devops@amuri.app
- **Assunto:** [SECURITY] Audit Tool Vulnerability

Tentaremos responder em até 24 horas úteis.

---

Cogitari Tech — Secure by default.
