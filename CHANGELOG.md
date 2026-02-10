# Changelog

Todas as alterações notáveis no projeto **Cogitari Audit Tool** serão documentadas neste arquivo.

O formato baseia-se em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [6.6] - 2026-02-09

### Adicionado

- **Header UX:** Reorganização completa da barra superior com agrupamento lógico de botões (Contexto, Ferramentas, Exportação).
- **Alinhamento:** Padronização da altura de todos os elementos interativos para 36px ou 40px.

## [6.5] - 2026-02-09

### Corrigido

- **Tooltips:** Resolução de bug de z-index e overflow que cortava os balões de ajuda na seção do GitHub Mockup.

## [6.4] - 2026-02-09

### Alterado

- **Branding:** Aplicação da paleta de cores oficial da Cogitari (Laranja #ea580c e Slate #0f172a) em todos os componentes.
- **Logotipo:** Implementação de fallback automático para SVG caso logo-cogitari.png não seja encontrado.

### Segurança

- **Assinaturas:** A seção de assinaturas agora inicia vazia por padrão, exigindo interação real do auditor para registrar o carimbo de tempo.

## [6.2 - 6.3] - 2026-02-09

### Adicionado

- **GitHub Integration (Mockup):** Interface simulada para conexão com repositórios e branches.
- **Email Automation (Mockup):** Campo visual para notificação de responsáveis técnicos.
- **Tooltips:** Ajuda contextual adicionada aos novos campos Beta.

## [6.0 - 6.1] - 2026-02-08

### Adicionado

- **Regra da Segunda-Feira:** Validação de compliance que bloqueia datas finais que não sejam segundas-feiras.
- **Modo de Teste:** Botão para preenchimento automático de dados fictícios (Lorem Ipsum) para validação de layout.
- **Proteção de Saída:** Alerta de navegador ao tentar fechar a aba com alterações não salvas.

### Corrigido

- **Grid Layout:** Alinhamento simétrico dos botões de Risco e Status.

## [5.0 - 5.5] - 2026-02-08

### Adicionado

- **Blocos de Código:** Campo dedicado com fonte monoespaçada para logs e snippets.
- **Tipos de Task:** Classificação técnica de achados (ex: Frontend, Security, DevOps).
- **Tooltips:** Sistema de ajuda clicável para campos do formulário.
- **Campos de Projeto:** Adição de "Projeto/Módulo" e "Ambiente" ao cabeçalho.

## [4.0 - 4.9] - 2026-02-07

### Adicionado

- **Assinaturas Dinâmicas:** Rastreabilidade automática baseada no auditor ativo.
- **Auto-Save:** Persistência local (localStorage) para prevenir perda de dados.
- **Exportação Multi-formato:** Suporte para PDF, DOCX, TXT e JSON.
- **Google Drive Sync:** Integração funcional com OAuth 2.0.

## [1.0 - 3.0] - 2026-01-26

### Inicial

- Lançamento da versão MVP Single-Page Application.
- Funcionalidades básicas de geração de PDF e gestão de achados.
