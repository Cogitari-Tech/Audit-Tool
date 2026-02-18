# GitHub Actions Workflow - CI/CD 100% Gratuito

## Configuração Completa do CI/CD

Este workflow utiliza **GitHub Actions Free Tier** (2000 minutos/mês) para automatizar testes e deploys.

---

## 📁 Estrutura de Arquivos

```
.github/
└── workflows/
    ├── ci.yml              # Testes em PRs
    ├── deploy-beta.yml     # Deploy para staging (beta)
    └── deploy-prod.yml     # Deploy para produção (main)
```

---

## 1️⃣ CI - Testes Automáticos

**Arquivo:** `.github/workflows/ci.yml`

```yaml
name: CI - Tests

on:
  pull_request:
    branches:
      - develop
      - beta
      - main
  push:
    branches:
      - develop

jobs:
  lint:
    name: Lint & Format Check
    runs-on: ubuntu-latest
    timeout-minutes: 5
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Check formatting (Prettier)
        run: npm run format:check

  typecheck:
    name: TypeScript Type Check
    runs-on: ubuntu-latest
    timeout-minutes: 5
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run typecheck

  test-unit:
    name: Unit Tests (Vitest)
    runs-on: ubuntu-latest
    timeout-minutes: 10
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test -- --coverage

      - name: Upload coverage to Codecov (Free)
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          fail_ci_if_error: false

  build:
    name: Build Check
    runs-on: ubuntu-latest
    timeout-minutes: 10
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Check bundle size
        run: |
          SIZE=$(du -sh dist | cut -f1)
          echo "Bundle size: $SIZE"
          # Alerta se > 2MB
          if [ $(du -b dist | cut -f1) -gt 2097152 ]; then
            echo "⚠️ Bundle muito grande (>2MB)"
            exit 1
          fi

  # 🚧 E2E Tests (Opcional - consome mais minutos)
  # Descomente se quiser rodar testes E2E no CI
  # test-e2e:
  #   name: E2E Tests (Playwright)
  #   runs-on: ubuntu-latest
  #   timeout-minutes: 20
  #   
  #   steps:
  #     - uses: actions/checkout@v4
  #     
  #     - uses: actions/setup-node@v4
  #       with:
  #         node-version: '20'
  #         cache: 'npm'
  #
  #     - name: Install dependencies
  #       run: npm ci
  #
  #     - name: Install Playwright
  #       run: npx playwright install --with-deps
  #
  #     - name: Run E2E tests
  #       run: npm run test:e2e
  #
  #     - name: Upload test results
  #       if: always()
  #       uses: actions/upload-artifact@v3
  #       with:
  #         name: playwright-report
  #         path: playwright-report/
```

---

## 2️⃣ Deploy para Beta (Staging)

**Arquivo:** `.github/workflows/deploy-beta.yml`

```yaml
name: Deploy to Beta (Staging)

on:
  push:
    branches:
      - beta

jobs:
  deploy-vercel:
    name: Deploy to Vercel (Preview)
    runs-on: ubuntu-latest
    timeout-minutes: 10
    
    environment:
      name: beta
      url: https://beta-audit-tool.vercel.app
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_BETA_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_BETA_ANON_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./apps/web

  notify-slack:
    name: Notify Team (Optional)
    needs: deploy-vercel
    runs-on: ubuntu-latest
    if: always()
    
    steps:
      - name: Send Slack notification
        if: env.SLACK_WEBHOOK_URL != ''
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "🚀 Deploy para Beta concluído!",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Deploy para Beta* ✅\n<https://beta-audit-tool.vercel.app|Ver site>"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## 3️⃣ Deploy para Produção

**Arquivo:** `.github/workflows/deploy-prod.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  create-release:
    name: Create Release Tag
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Get version from package.json
        id: version
        run: |
          VERSION=$(node -p "require('./apps/web/package.json').version")
          echo "version=$VERSION" >> $GITHUB_OUTPUT
      
      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ steps.version.outputs.version }}
          release_name: Release v${{ steps.version.outputs.version }}
          draft: false
          prerelease: false

  deploy-vercel:
    name: Deploy to Vercel (Production)
    runs-on: ubuntu-latest
    timeout-minutes: 10
    
    environment:
      name: production
      url: https://app.cogitari.com.br
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_PROD_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_PROD_ANON_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          alias-domains: 'app.cogitari.com.br'
          working-directory: ./apps/web

  notify-team:
    name: Notify Production Deploy
    needs: deploy-vercel
    runs-on: ubuntu-latest
    if: always()
    
    steps:
      - name: Send notification
        run: |
          echo "🎉 Deploy para produção concluído!"
          echo "URL: https://app.cogitari.com.br"
```

---

## 🔐 Secrets Necessários no GitHub

Configure em: `Settings → Secrets and variables → Actions`

### Vercel (Deploy)
```
VERCEL_TOKEN           # Token da Vercel (gratuito)
VERCEL_ORG_ID          # ID da organização
VERCEL_PROJECT_ID      # ID do projeto
```

**Como obter:**
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# No diretório do projeto
vercel link

# Copiar IDs do arquivo .vercel/project.json
```

### Supabase (Beta)
```
SUPABASE_BETA_URL       # URL do projeto Supabase de staging
SUPABASE_BETA_ANON_KEY  # Chave anônima (public)
```

### Supabase (Produção)
```
SUPABASE_PROD_URL       # URL do projeto Supabase de produção
SUPABASE_PROD_ANON_KEY  # Chave anônima (public)
```

### Opcional
```
SLACK_WEBHOOK_URL       # Para notificações no Slack (grátis)
```

---

## 📊 Monitoramento de Uso (GitHub Actions)

### Verificar minutos consumidos

1. Acesse: `https://github.com/Cogitari-Tech/Audit-Tool/settings/billing`
2. Veja: **Actions & Packages**

### Estimativa de Consumo

```
Por PR (develop):
- Lint: ~1 min
- TypeCheck: ~1 min
- Tests: ~3 min
- Build: ~2 min
Total: ~7 min/PR

Por Deploy (beta/main):
- Build + Deploy: ~5 min
Total: ~5 min/deploy

Estimativa mensal (20 PRs + 10 deploys):
= (20 × 7) + (10 × 5)
= 140 + 50
= 190 minutos/mês

✅ Bem abaixo do limite de 2000 min/mês!
```

---

## 🎯 Otimizações para Economizar Minutos

### 1. Cache de dependências
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'  # ✅ Economiza ~2 min/job
```

### 2. Timeouts
```yaml
jobs:
  test:
    timeout-minutes: 10  # ✅ Evita jobs travados
```

### 3. Jobs condicionais
```yaml
if: github.event.pull_request.draft == false  # ✅ Não roda em draft PRs
```

### 4. Paralelização
```yaml
jobs:
  lint:    # Roda em paralelo
  test:    # Roda em paralelo
  build:   # Roda em paralelo
```

---

## 🚀 Como Usar

### 1. Configurar workflows
```bash
# Copiar workflows para o repositório
mkdir -p .github/workflows
cp github-actions.md/.github/workflows/* .github/workflows/

git add .github/workflows/
git commit -m "ci: configura GitHub Actions"
git push origin main
```

### 2. Configurar secrets
- Acesse: https://github.com/Cogitari-Tech/Audit-Tool/settings/secrets/actions
- Adicione todos os secrets listados acima

### 3. Fazer primeiro PR
```bash
git checkout -b seu-nickname
git push origin seu-nickname
gh pr create --base develop --title "test: primeiro PR"
```

### 4. Verificar execução
- Actions: https://github.com/Cogitari-Tech/Audit-Tool/actions

---

## 🆘 Troubleshooting

### Workflow não executou
- ✅ Verifique se o arquivo está em `.github/workflows/`
- ✅ Verifique se o branch está correto em `on.push.branches`

### Build falhou
- ✅ Verifique se os secrets estão configurados
- ✅ Rode `npm run build` localmente primeiro

### Deploy não funcionou
- ✅ Verifique se o token da Vercel está válido
- ✅ Rode `vercel --prod` localmente para testar

---

**Cogitari Tech** - CI/CD 100% gratuito e profissional! 🚀