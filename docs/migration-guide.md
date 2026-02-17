# Guia de Migração - SPA Legado → Arquitetura Modular

## 🎯 Objetivo

Transformar o sistema monolítico atual (980 linhas em um único HTML) em uma arquitetura modular, escalável e testável, mantendo todas as funcionalidades existentes e adicionando novos módulos financeiros.

---

## 📋 Pré-requisitos

```bash
# Node.js 20+ (recomendado: 20.11.0)
node --version

# pnpm (gerenciador de pacotes)
npm install -g pnpm

# Supabase CLI
npm install -g supabase

# Git
git --version
```

---

## 🚀 Fase 1: Setup do Projeto (Semana 1)

### 1.1 Criar Monorepo com npm workspaces

```bash
# Criar estrutura base
mkdir Audit-Tool
cd Audit-Tool

# Inicializar git
git init
git remote add origin https://github.com/Cogitari-Tech/Audit-Tool.git

# Criar estrutura de pastas
mkdir -p apps/web packages/{core,ui,shared} supabase/{migrations,functions} e2e .github/workflows

# Criar package.json root com workspaces
npm init -y
# Editar package.json para adicionar "workspaces": ["apps/*", "packages/*"]

# Instalar dependências
npm install
```

### 1.2 Configurar Workspaces

Editar `package.json`:

```json
{
  "name": "cogitari-platform",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "npm run dev --workspace=apps/web",
    "build": "npm run build --workspaces --if-present",
    "test": "npm run test --workspaces --if-present"
  }
}
```

### 1.3 Configurar Supabase (Free Tier)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Inicializar Supabase localmente
npx supabase init

# Login no Supabase
npx supabase login

# Criar projeto no dashboard
# https://app.supabase.com → New Project
# Tier: Free (500MB database, 1GB storage)

# Copiar URL e anon key para .env
cp .env.example .env
# Editar .env com suas credenciais
```

### 1.4 Criar Branch de Desenvolvimento

```bash
# Criar branch local com seu nickname
git checkout -b <seu-nickname>

# Criar .gitignore
cat > .gitignore << EOF
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
EOF

# Primeiro commit
git add .
git commit -m "chore: setup inicial do projeto"

# Push para branch remota
git push -u origin <seu-nickname>
```

---

## 🔄 Fase 2: Migração do Módulo de Auditoria (Semana 2-3)

### 2.1 Extrair Lógica de Negócio

**Antes (SPA Monolítico):**
```javascript
// Tudo misturado em funções globais
function addFinding() {
  findingCount++;
  const div = document.createElement('div');
  div.innerHTML = `<div class="finding-card">...</div>`;
  container.appendChild(div);
  registerAction(); // Assinatura manual
}
```

**Depois (Clean Architecture):**
```typescript
// packages/core/src/usecases/audit/AddFinding.ts
export class AddFinding {
  constructor(private repo: IAuditRepository) {}
  
  async execute(input: AddFindingInput): Promise<void> {
    const finding = Finding.create(input);
    await this.repo.saveFinding(finding);
    
    // Assinatura automática
    const signature = Signature.generate(input.userId, 'add_finding');
    await this.repo.saveSignature(signature);
  }
}
```

### 2.2 Migrar Estado

**Antes:**
```javascript
let auditData = {};
localStorage.setItem('audit_draft', JSON.stringify(auditData));
```

**Depois (Zustand + Supabase):**
```typescript
// apps/web/src/store/auditStore.ts
export const useAuditStore = create<AuditStore>()(
  persist(
    (set) => ({
      currentAudit: null,
      findings: [],
      addFinding: (finding) => set((state) => ({
        findings: [...state.findings, finding]
      }))
    }),
    { name: 'audit-storage' }
  )
);
```

### 2.3 Componetizar UI

**Antes:**
```javascript
div.innerHTML = `
  <div class="finding-card">
    <input type="text" class="title-input">
    <textarea class="description"></textarea>
  </div>
`;
```

**Depois:**
```tsx
// apps/web/src/modules/audit/components/FindingCard.tsx
export function FindingCard({ finding, onUpdate }: Props) {
  const [title, setTitle] = useState(finding.title);
  
  return (
    <div className="finding-card">
      <Input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea value={finding.description} />
    </div>
  );
}
```

### 2.4 Fluxo de Trabalho

```bash
# 1. Desenvolver na sua branch
git checkout -b <seu-nickname>
npm run dev
# Fazer alterações...
git add .
git commit -m "feat: migra módulo de auditoria"
git push origin <seu-nickname>

# 2. Abrir PR para develop
gh pr create --base develop --head <seu-nickname> \
  --title "feat: migra módulo de auditoria para arquitetura modular"

# 3. GitHub Actions roda testes automaticamente
# 4. Após aprovação, merge para develop
```

### 2.5 Checklist de Migração - Auditoria

- [ ] ✅ Entidade `Audit` criada
- [ ] ✅ Entidade `Finding` criada
- [ ] ✅ Entidade `Signature` criada
- [ ] ✅ Repositório Supabase implementado
- [ ] ✅ Casos de uso migrados:
  - [ ] CreateAudit
  - [ ] AddFinding
  - [ ] ValidateSignatures
  - [ ] GeneratePDF
- [ ] ✅ Componentes React criados:
  - [ ] AuditEditor
  - [ ] FindingCard
  - [ ] SignaturePanel
- [ ] ✅ Testes unitários (Vitest)
- [ ] ✅ PR aberto para develop
- [ ] ✅ Testes passando no CI
- [ ] ✅ Code review aprovado

---

## 💰 Fase 3: Implementar Módulo Financeiro (Semana 4-5)

### 3.1 Criar Estrutura do Módulo

```bash
cd apps/web/src/modules
mkdir -p finance/{pages,components,hooks,services,types}
```

### 3.2 Implementar Plano de Contas

```sql
-- supabase/migrations/XXXXXXX_create_accounts.sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('Ativo', 'Passivo', 'Receita', 'Despesa', 'Patrimônio')),
  parent_id UUID REFERENCES accounts(id),
  is_analytical BOOLEAN DEFAULT false
);

-- Inserir plano de contas padrão
INSERT INTO accounts (code, name, type, is_analytical) VALUES
  ('1', 'ATIVO', 'Ativo', false),
  ('1.1', 'Ativo Circulante', 'Ativo', false),
  ('1.1.01', 'Caixa', 'Ativo', true),
  ('1.1.02', 'Bancos', 'Ativo', true),
  ('2', 'PASSIVO', 'Passivo', false),
  ('3', 'RECEITAS', 'Receita', false),
  ('3.1', 'Receitas de Vendas', 'Receita', false),
  ('3.1.01', 'Vendas de Produtos', 'Receita', true),
  ('4', 'DESPESAS', 'Despesa', false),
  ('4.1', 'Despesas Operacionais', 'Despesa', false),
  ('4.1.01', 'Salários', 'Despesa', true),
  ('4.1.02', 'Aluguel', 'Despesa', true);
```

### 3.3 Implementar Transações

```typescript
// packages/core/src/entities/Transaction.ts
export class Transaction {
  // (Ver arquivo completo em Transaction-entity.ts)
}

// packages/core/src/usecases/finance/RecordTransaction.ts
export class RecordTransaction {
  // (Ver arquivo completo em RecordTransaction-usecase.ts)
}
```

### 3.4 Criar UI de Fluxo de Caixa

```tsx
// apps/web/src/modules/finance/pages/CashFlow.tsx
export default function CashFlow() {
  // (Ver arquivo completo em CashFlow-component.tsx)
}
```

### 3.5 Checklist - Módulo Financeiro

- [ ] ✅ Entidade `Transaction` criada
- [ ] ✅ Entidade `Account` criada
- [ ] ✅ Casos de uso implementados:
  - [ ] RecordTransaction
  - [ ] CalculateBalance
  - [ ] GenerateBalanceSheet
  - [ ] GenerateIncomeStatement
- [ ] ✅ Páginas criadas:
  - [ ] CashFlow (Fluxo de Caixa)
  - [ ] BalanceSheet (Balanço Patrimonial)
  - [ ] IncomeStatement (DRE)
- [ ] ✅ Gráficos com Recharts
- [ ] ✅ Exportação para Excel (SheetJS)
- [ ] ✅ Testes de integração

---

## 📊 Fase 4: Implementar Módulo de Compliance (Semana 6)

### 4.1 Análise SWOT

```typescript
// packages/core/src/entities/SwotAnalysis.ts
export class SwotAnalysis {
  constructor(
    public readonly id: string,
    public readonly companyName: string,
    public readonly analysisDate: Date,
    public strengths: string[],
    public weaknesses: string[],
    public opportunities: string[],
    public threats: string[]
  ) {}

  addStrength(item: string): void {
    this.strengths.push(item);
  }

  removeStrength(index: number): void {
    this.strengths.splice(index, 1);
  }

  exportToJSON(): string {
    return JSON.stringify(this, null, 2);
  }
}
```

### 4.2 UI de SWOT

```tsx
// apps/web/src/modules/compliance/pages/SwotAnalysis.tsx
export default function SwotAnalysis() {
  const [swot, setSwot] = useState<SwotAnalysis | null>(null);

  return (
    <div className="grid grid-cols-2 gap-4 p-8">
      <SwotQuadrant 
        title="Forças" 
        items={swot?.strengths || []} 
        color="green"
        onAdd={(item) => swot?.addStrength(item)}
      />
      {/* Outros quadrantes... */}
    </div>
  );
}
```

### 4.3 Matriz de Riscos

```tsx
// apps/web/src/modules/compliance/pages/RiskMatrix.tsx
export default function RiskMatrix() {
  return (
    <div className="grid grid-cols-5 grid-rows-5 gap-1">
      {Array.from({ length: 25 }).map((_, i) => (
        <div 
          key={i}
          className={getRiskColor(i)}
        >
          {/* Célula da matriz */}
        </div>
      ))}
    </div>
  );
}
```

---

## 🧪 Fase 5: Testes Automatizados (Semana 7)

### 5.1 Configurar Vitest (Unit Tests)

```bash
npm install -D vitest @vitest/ui
```

```typescript
// packages/core/tests/RecordTransaction.test.ts
import { describe, it, expect, vi } from 'vitest';
import { RecordTransaction } from '../src/usecases/finance/RecordTransaction';

describe('RecordTransaction', () => {
  it('should record a valid transaction', async () => {
    const mockRepo = {
      saveTransaction: vi.fn(),
      getAccountById: vi.fn().mockResolvedValue({
        id: '1',
        isAnalytical: true
      })
    };

    const useCase = new RecordTransaction(mockRepo as any);
    
    await useCase.execute({
      date: new Date(),
      description: 'Test',
      accountDebitId: '1',
      accountCreditId: '2',
      amount: 100,
      userId: 'user1'
    });

    expect(mockRepo.saveTransaction).toHaveBeenCalled();
  });

  it('should throw error for zero amount', async () => {
    const useCase = new RecordTransaction({} as any);
    
    await expect(
      useCase.execute({
        date: new Date(),
        description: 'Test',
        accountDebitId: '1',
        accountCreditId: '2',
        amount: 0,
        userId: 'user1'
      })
    ).rejects.toThrow('Valor deve ser maior que zero');
  });
});
```

**Rodar testes:**
```bash
npm test
npm run test:coverage
npm run test:watch
```

### 5.2 Configurar Playwright (E2E Tests)

```bash
npm create playwright@latest
```

```typescript
// e2e/finance.spec.ts
import { test, expect } from '@playwright/test';

test('should create a transaction', async ({ page }) => {
  // Login
  await page.goto('http://localhost:5173/login');
  await page.fill('input[name="email"]', 'test@cogitari.com.br');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // Navegar para Fluxo de Caixa
  await page.goto('http://localhost:5173/finance/cash-flow');

  // Abrir modal
  await page.click('button:has-text("Nova Transação")');

  // Preencher formulário
  await page.fill('input[name="description"]', 'Pagamento teste');
  await page.selectOption('select[name="accountDebit"]', '1.1.01');
  await page.selectOption('select[name="accountCredit"]', '3.1.01');
  await page.fill('input[name="amount"]', '1000');

  // Submeter
  await page.click('button:has-text("Salvar")');

  // Verificar sucesso
  await expect(page.locator('text=Pagamento teste')).toBeVisible();
});
```

**Rodar testes E2E:**
```bash
npm run test:e2e
npm run test:e2e -- --ui
npm run test:e2e -- --debug
```

### 5.3 Fluxo de Trabalho com Testes

```bash
# 1. Desenvolver feature
git checkout -b <seu-nickname>
npm run dev

# 2. Escrever testes
npm run test:watch  # Roda em modo watch

# 3. Verificar cobertura
npm run test:coverage

# 4. Rodar testes E2E localmente (opcional)
npm run test:e2e

# 5. Commit e push
git add .
git commit -m "feat: adiciona módulo financeiro com testes"
git push origin <seu-nickname>

# 6. Abrir PR para develop
gh pr create --base develop --head <seu-nickname>

# 7. GitHub Actions roda todos os testes automaticamente
# - Lint
# - TypeCheck  
# - Unit tests
# - Build
```

---

## 📦 Fase 6: Build e Deploy (Semana 8)

### 6.1 Configurar CI/CD (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install

      - name: Run unit tests
        run: pnpm test

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Build
        run: pnpm build
```

### 6.2 Deploy (Vercel)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
cd apps/web
vercel --prod
```

---

## 🎯 Resultados Esperados

### Antes (SPA Monolítico):
- ❌ 980 linhas em um arquivo
- ❌ Difícil testar
- ❌ Impossível escalar
- ❌ Estado espalhado em funções globais

### Depois (Arquitetura Modular):
- ✅ Código organizado em módulos
- ✅ ~95% de cobertura de testes
- ✅ Novos módulos em 2-3 dias
- ✅ Estado centralizado (Zustand + Supabase)
- ✅ Performance otimizada (lazy loading)
- ✅ Segurança aprimorada (RLS do Supabase)

---

## 📊 Métricas de Sucesso

| Métrica | Antes | Depois | Meta |
|---------|-------|--------|------|
| Linhas de código/arquivo | 980 | <200 | <300 |
| Tempo para adicionar feature | 5 dias | 2 dias | <3 dias |
| Cobertura de testes | 0% | 95% | >80% |
| Bugs em produção | 8/mês | 1/mês | <2/mês |
| Tempo de build | N/A | 15s | <30s |

---

## 🆘 Troubleshooting

### Problema: Supabase não conecta

```bash
# Verificar se está rodando
npx supabase status

# Reiniciar
npx supabase stop
npx supabase start
```

### Problema: Módulo não carrega

```typescript
// Verificar se está registrado em registry.ts
import financeModule from './finance/module.config';
moduleRegistry.register(financeModule);
```

### Problema: Testes falhando

```bash
# Limpar cache
pnpm test --clearCache

# Rodar em modo debug
pnpm test --reporter=verbose
```

---

**Cogitari Tech** — Migração concluída com sucesso! 🚀